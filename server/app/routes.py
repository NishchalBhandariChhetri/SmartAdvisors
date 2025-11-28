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
    
    # 1. PRIORITIES
    if user_prefs.get('extraCredit'):
        if "extra credit" in tags: score += 2.0
    
    if user_prefs.get('clearGrading'):
        if "clear grading" in tags: score += 1.5
        elif "tough grader" in tags: score -= 0.5 

    if user_prefs.get('goodFeedback'):
        if "good feedback" in tags: score += 1.5

    if user_prefs.get('caring'):
        if "caring" in tags or "respected" in tags or "inspirational" in tags or "accessible" in tags:
            score += 2.0

    # 2. LEARNING STYLE
    if user_prefs.get('lectureHeavy'):
        if "amazing lectures" in tags: score += 2.0
        elif "lecture heavy" in tags: score += 1.0 
    
    if user_prefs.get('groupProjects'):
        if "group projects" in tags: score += 1.5
    else:
        if "group projects" in tags: score -= 0.5

    # 3. TOLERANCES
    if not user_prefs.get('testHeavy'):
        if "test heavy" in tags or "tests are tough" in tags: score -= 3.0

    if not user_prefs.get('homeworkHeavy'):
        if "lots of homework" in tags or "so many papers" in tags: score -= 2.0

    if not user_prefs.get('strictAttendance'):
        if "skip class" in tags or "participation matters" in tags: score -= 1.5

    if not user_prefs.get('popQuizzes'):
        if "pop quizzes" in tags: score -= 2.5

    return round(score, 2)

@api_bp.route('/parse-transcript', methods=['POST'])
def parse_transcript():
    try:
        if 'transcript' not in request.files: return jsonify({'error': 'No file provided'}), 400
        file = request.files['transcript']
        temp_dir = tempfile.gettempdir()
        filename = secure_filename(file.filename) # type: ignore
        temp_path = os.path.join(temp_dir, filename)
        file.save(temp_path)
        courses = extract_all_courses(temp_path)
        if os.path.exists(temp_path): os.remove(temp_path)
        return jsonify({'success': True, 'courses': courses}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    try:
        department = request.form.get('department')
        completed_courses = []
        if 'completed_courses' in request.form:
            try: completed_courses = json.loads(request.form.get('completed_courses')) # type: ignore
            except: pass
        elif 'transcript' in request.files:
            file = request.files['transcript']
            temp_dir = tempfile.gettempdir()
            filename = secure_filename(file.filename) # type: ignore
            temp_path = os.path.join(temp_dir, filename)
            file.save(temp_path)
            completed_courses = extract_all_courses(temp_path)
            if os.path.exists(temp_path): os.remove(temp_path)

        user_prefs = {}
        try: user_prefs = json.loads(request.form.get('preferences', '{}'))
        except: pass

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
                            # Robust Name Matching
                            db_prof = Professor.query.filter(Professor.name.ilike(prof_name)).first()
                            if not db_prof and ',' in prof_name:
                                parts = prof_name.split(',')
                                if len(parts) >= 2:
                                    swapped = f"{parts[1].strip()} {parts[0].strip()}"
                                    db_prof = Professor.query.filter(Professor.name.ilike(swapped)).first()
                            if not db_prof:
                                parts = prof_name.replace(',', '').split()
                                if len(parts) > 0:
                                    last_name = parts[0] if ',' in prof_name else parts[-1]
                                    db_prof = Professor.query.filter(Professor.name.ilike(f"%{last_name}%")).first()

                            match_score = calculate_match_score(db_prof, user_prefs)
                            
                            final_rating = 0.0
                            if db_prof and db_prof.rating is not None: 
                                try: final_rating = float(db_prof.rating)
                                except: final_rating = 0.0
                            else:
                                try: final_rating = round(float(offer.get('course_gpa', 0) or 0), 1)
                                except: final_rating = 0.0
                            
                            final_tags = []
                            if db_prof and db_prof.tags: final_tags = str(db_prof.tags).split(',')

                            final_difficulty = "Moderate"
                            if db_prof and db_prof.difficulty:
                                try:
                                    diff_val = float(db_prof.difficulty)
                                    if diff_val < 2.5: final_difficulty = "Easy"
                                    elif diff_val > 3.8: final_difficulty = "Hard"
                                except: pass

                            professors_list.append({
                                'id': str(len(professors_list)),
                                'name': prof_name,
                                'rating': final_rating,
                                'difficulty': final_difficulty,
                                'matchScore': match_score,
                                'schedule': f"{offer.get('year','')} {offer.get('semester','')}".strip(),
                                'tags': final_tags,
                                'reviewCount': 0, 'classSize': 'Unknown', 'assessmentType': 'Unknown', 'attendance': 'Unknown'
                            })
                        except: continue
            
            professors_list.sort(key=lambda x: x['matchScore'], reverse=True)
            result.append({'courseCode': code, 'courseName': course['Course_Name'], 'professors': professors_list})
        
        return jsonify({'success': True, 'recommendations': result}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500