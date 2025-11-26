from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import tempfile
from .scripts.recommendation_engine import (
    get_department_courses,
    filter_eligible_courses_unique,
    get_professor_offerings_for_course
)
from .scripts.parse_transcript import extract_all_courses

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    """Upload transcript PDF and get course recommendations"""
    
    import sys
    import traceback
    
    print("\n=== RECOMMENDATIONS ROUTE CALLED ===", file=sys.stderr, flush=True)
    
    try:
        print("Step 1: Checking for file in request", file=sys.stderr, flush=True)
        
        if 'transcript' not in request.files:
            print("ERROR: No transcript in request.files", file=sys.stderr, flush=True)
            return jsonify({'error': 'No transcript file provided'}), 400
        
        file = request.files['transcript']
        print(f"Step 2: Got file: {file.filename}", file=sys.stderr, flush=True)
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.endswith('.pdf'):
            return jsonify({'error': 'Only PDF files accepted'}), 400
        
        department = request.args.get('department') or request.form.get('department')
        print(f"Step 3: Department: {department}", file=sys.stderr, flush=True)
        
        if not department:
            return jsonify({'error': 'Department required'}), 400
        
        import tempfile
        import os
        from werkzeug.utils import secure_filename
        
        temp_dir = tempfile.gettempdir()
        filename = secure_filename(file.filename)
        temp_path = os.path.join(temp_dir, filename)
        
        print(f"Step 4: Saving to {temp_path}", file=sys.stderr, flush=True)
        file.save(temp_path)
        print("Step 5: File saved successfully", file=sys.stderr, flush=True)
        
        # Import the functions
        print("Step 6: Importing functions...", file=sys.stderr, flush=True)
        from app.scripts.recommendation_engine import (
            get_department_courses,
            filter_eligible_courses_unique,
            get_professor_offerings_for_course
        )
        from app.scripts.parse_transcript import extract_all_courses
        print("Step 7: Imports successful", file=sys.stderr, flush=True)
        
        print("Step 8: Getting department courses...", file=sys.stderr, flush=True)
        all_courses = get_department_courses(department)
        print(f"Step 9: Found {len(all_courses)} courses", file=sys.stderr, flush=True)
        
        print("Step 10: Extracting courses from PDF...", file=sys.stderr, flush=True)
        completed = extract_all_courses(temp_path)
        print(f"Step 11: Completed courses: {completed}", file=sys.stderr, flush=True)
        
        print("Step 12: Filtering eligible courses...", file=sys.stderr, flush=True)
        eligible = filter_eligible_courses_unique(all_courses, completed)
        print(f"Step 13: Found {len(eligible)} eligible courses", file=sys.stderr, flush=True)
        
        result = []
        for code, course in eligible.items():
            offerings = get_professor_offerings_for_course(code)
            
            professors = []
            seen = set()
            for offer in offerings:
                for prof in offer['instructors']:
                    if prof not in seen:
                        seen.add(prof)
                        professors.append({
                            'id': str(len(professors) + 1),
                            'name': prof,
                            'rating': round(float(offer.get('course_gpa', 0) or 0), 1),
                            'reviewCount': 0,
                            'difficulty': 'Moderate',
                            'matchScore': 85,
                            'schedule': f"{offer.get('year', '')} {offer.get('semester', '')}".strip(),
                            'classSize': 'Unknown',
                            'assessmentType': 'Unknown',
                            'attendance': 'Unknown',
                            'tags': []
                        })
            
            result.append({
                'courseCode': code,
                'courseName': course['Course_Name'],
                'professors': professors
            })
        
        print(f"Step 14: Returning {len(result)} recommendations", file=sys.stderr, flush=True)
        
        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify({
            'success': True,
            'department': department,
            'completed_courses': completed,
            'recommendations': result,
            'total_eligible': len(result)
        }), 200
        
    except Exception as e:
        print(f"\n!!! EXCEPTION OCCURRED !!!", file=sys.stderr, flush=True)
        print(f"Error type: {type(e).__name__}", file=sys.stderr, flush=True)
        print(f"Error message: {str(e)}", file=sys.stderr, flush=True)
        print(f"Full traceback:", file=sys.stderr, flush=True)
        traceback.print_exc(file=sys.stderr)
        
        return jsonify({'error': str(e)}), 500