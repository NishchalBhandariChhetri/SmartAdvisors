from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import tempfile
import sys
import traceback
import json

from app.models import Professor

from .scripts.recommendation_engine import (
    get_department_courses,
    filter_eligible_courses_unique,
    get_professor_offerings_for_course
)
from .scripts.parse_transcript import extract_all_courses

api_bp = Blueprint('api', __name__, url_prefix='/api')

def calculate_match_score(professor_obj, user_prefs):
    if not professor_obj: return 0.0
    
    try: score = float(professor_obj.rating) if professor_obj.rating else 0.0
    except: score = 0.0
    
    try: tags = str(professor_obj.tags).lower() if professor_obj.tags else ""
    except: tags = ""
    
    if user_prefs.get('easyGrader'):
        if "easy grader" in tags: score += 2.0
        elif "tough grader" in tags: score -= 2.0
    if user_prefs.get('caring'):
        if "caring" in tags or "respected" in tags: score += 1.5
    if not user_prefs.get('testHeavy'):
        if "test heavy" in tags: score -= 3.0
    if not user_prefs.get('attendanceStrict'):
        if "attendance mandatory" in tags: score -= 1.0

    return round(score, 2)

# --- NEW ROUTE: Just reads the PDF and returns the list of courses ---
@api_bp.route('/parse-transcript', methods=['POST'])
def parse_transcript():
    print("\n=== PARSE TRANSCRIPT ROUTE CALLED ===", file=sys.stderr)
    try:
        if 'transcript' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['transcript']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Save temp file
        temp_dir = tempfile.gettempdir()
        filename = secure_filename(file.filename)
        temp_path = os.path.join(temp_dir, filename)
        file.save(temp_path)
        
        # Extract courses
        courses = extract_all_courses(temp_path)
        print(f"Found courses: {courses}", file=sys.stderr)
        
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({'success': True, 'courses': courses}), 200
        
    except Exception as e:
        print(f"Error parsing: {e}", file=sys.stderr)
        return jsonify({'error': str(e)}), 500

# --- UPDATED ROUTE: Generates recommendations based on the LIST of courses ---
@api_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    print("\n=== RECOMMENDATIONS ROUTE CALLED ===", file=sys.stderr)
    
    try:
        department = request.form.get('department')
        if not department:
            return jsonify({'error': 'Department required'}), 400

        # 1. GET COMPLETED COURSES
        # We accept the raw list from the frontend (Step 2 result)
        completed_courses = []
        if 'completed_courses' in request.form:
            try:
                completed_courses = json.loads(request.form.get('completed_courses'))
                print(f"Received completed courses list: {len(completed_courses)} items", file=sys.stderr)
            except:
                print("Error parsing completed_courses JSON", file=sys.stderr)
        
        # Fallback: If they somehow uploaded a file here instead (safety check)
        elif 'transcript' in request.files:
            file = request.files['transcript']
            temp_dir = tempfile.gettempdir()
            filename = secure_filename(file.filename)
            temp_path = os.path.join(temp_dir, filename)
            file.save(temp_path)
            completed_courses = extract_all_courses(temp_path)
            if os.path.exists(temp_path): os.remove(temp_path)

        # 2. GET PREFERENCES
        user_prefs = {}
        try:
            user_prefs = json.loads(request.form.get('preferences', '{}'))
        except: pass

        # 3. LOGIC ENGINE
        all_courses = get_department_courses(department)
        eligible = filter_eligible_courses_unique(all_courses, completed_courses)
        
        result = []
        
        for code, course in eligible.items():
            offerings = get_professor_offerings_for_course(code)
            
            professors_list = []
            seen = set()
            
            for offer in offerings:
                for prof_name in offer['instructors']:
                    if prof_name not in seen:
                        seen.add(prof_name)
                        
                        try:
                            # Name Matching
                            db_prof = Professor.query.filter(Professor.name.ilike(prof_name)).first()
                            
                            # Swap check "Smith, John"
                            if not db_prof and ',' in prof_name:
                                parts = prof_name.split(',')
                                if len(parts) >= 2:
                                    swapped = f"{parts[1].strip()} {parts[0].strip()}"
                                    db_prof = Professor.query.filter(Professor.name.ilike(swapped)).first()
                            
                            # Last Name check
                            if not db_prof:
                                parts = prof_name.replace(',', '').split()
                                if len(parts) > 0:
                                    last_name = parts[0] if ',' in prof_name else parts[-1]
                                    db_prof = Professor.query.filter(Professor.name.ilike(f"%{last_name}%")).first()

                            # Scoring
                            match_score = calculate_match_score(db_prof, user_prefs)
                            
                            # Data Extraction
                            final_rating = 0.0
                            if db_prof and db_prof.rating is not None: 
                                try: final_rating = float(db_prof.rating)
                                except: final_rating = 0.0
                            else:
                                try: final_rating = round(float(offer.get('course_gpa', 0) or 0), 1)
                                except: final_rating = 0.0
                            
                            final_tags = []
                            if db_prof and db_prof.tags:
                                final_tags = str(db_prof.tags).split(',')

                            final_difficulty = "Moderate"
                            if db_prof and db_prof.difficulty:
                                try:
                                    diff_val = float(db_prof.difficulty)
                                    if diff_val < 2.5: final_difficulty = "Easy"
                                    elif diff_val > 3.8: final_difficulty = "Hard"
                                except: pass

                            professors_list.append({
                                'id': str(len(professors_list) + 1),
                                'name': prof_name,
                                'rating': final_rating,
                                'difficulty': final_difficulty,
                                'matchScore': match_score,
                                'schedule': f"{offer.get('year', '')} {offer.get('semester', '')}".strip(),
                                'tags': final_tags,
                                'reviewCount': 0, 'classSize': 'Unknown', 'assessmentType': 'Unknown', 'attendance': 'Unknown'
                            })
                        except Exception as inner_e:
                            print(f"Skipping prof {prof_name}: {inner_e}", file=sys.stderr)
                            continue
            
            professors_list.sort(key=lambda x: x['matchScore'], reverse=True)
            
            result.append({
                'courseCode': code,
                'courseName': course['Course_Name'],
                'professors': professors_list
            })
        
        return jsonify({
            'success': True,
            'recommendations': result
        }), 200
        
    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return jsonify({'error': str(e)}), 500