def recommend_courses(missing_skills_dict):
    dummy_course_links = {
        "python": "https://youtube.com/python-course",
        "ml": "https://youtube.com/ml-course",
        "sql": "https://youtube.com/sql-course",
        "html": "https://youtube.com/html-course",
        "css": "https://youtube.com/css-course",
        "javascript": "https://youtube.com/javascript-course"
    }

    recommendations = {}
    for role, skills in missing_skills_dict.items():
        courses = [dummy_course_links.get(skill, f"https://youtube.com/search?q={skill}") for skill in skills]
        recommendations[role] = courses

    return recommendations
