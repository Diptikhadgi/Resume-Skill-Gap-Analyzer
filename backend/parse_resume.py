import re
from pdfminer.high_level import extract_text

# Predefined skills dictionary for each job role
SKILLS_DB = {
    "data scientist": ["python", "machine learning", "pandas", "numpy", "deep learning", "statistics"],
    "frontend developer": ["javascript", "react", "html", "css", "redux", "tailwind"],
    "backend developer": ["python", "django", "flask", "node.js", "sql", "mongodb"],
}

def extract_text_from_pdf(file_path):
    try:
        return extract_text(file_path)
    except Exception as e:
        return ""

def extract_resume_data(file_path, job_role=""):
    text = extract_text_from_pdf(file_path)
    lower_text = text.lower()

    # Split into lines for name detection
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    # --- Name Extraction Fix ---
    name = "N/A"
    if lines:
        first_line = lines[0]
        if (
            len(first_line.split()) <= 4  # short enough to be a name
            and "resume" not in first_line.lower()
            and "cv" not in first_line.lower()
        ):
            name = first_line.strip()
        elif len(lines) > 1:  # try second line if first line is useless
            second_line = lines[1]
            if (
                len(second_line.split()) <= 4
                and "resume" not in second_line.lower()
                and "cv" not in second_line.lower()
            ):
                name = second_line.strip()

    # Email & Phone
    email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}", text)
    phone_match = re.search(r"\+?\d[\d -]{8,12}\d", text)

    email = email_match.group(0) if email_match else "N/A"
    phone = phone_match.group(0) if phone_match else "N/A"

    # Extract skills
    found_skills = []
    for skill_list in SKILLS_DB.values():
        for skill in skill_list:
            if skill in lower_text:
                found_skills.append(skill)

    found_skills = list(set(found_skills))  # remove duplicates

    # Job-role specific missing skills
    missing_skills = []
    suggestions = "No specific suggestions."
    if job_role and job_role in SKILLS_DB:
        expected_skills = SKILLS_DB[job_role]
        missing_skills = [s for s in expected_skills if s not in found_skills]
        if missing_skills:
            suggestions = f"To improve as a {job_role}, work on: {', '.join(missing_skills)}"

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": found_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
    }
