import json

def load_job_roles():
    with open("data/job_roles.json") as f:
        return json.load(f)

def match_skills(user_skills):
    job_data = load_job_roles()
    match_results = []
    missing_skills_all = {}

    for role, required_skills in job_data.items():
        matched = set(user_skills).intersection(set(required_skills))
        match_percent = len(matched) / len(required_skills)
        if match_percent >= 0.5:
            missing = list(set(required_skills) - set(user_skills))
            match_results.append(role)
            missing_skills_all[role] = missing

    return match_results, missing_skills_all
