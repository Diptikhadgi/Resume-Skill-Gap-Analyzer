
import re
from collections import Counter
from typing import List, Dict, Any, Tuple

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def tokens(text: str) -> List[str]:
    text = clean_text(text)
    words = re.findall(r"[a-z0-9\+\#\.\-]+", text)
    return words

def estimate_experience_years(text: str) -> float:
    text = text.lower()
    m = re.findall(r'(\d{1,2})\s*\+\s*years?|\b(\d{1,2})\s+years?\b', text)
    for tup in m:
        for g in tup:
            if g:
                return float(g)

    ranges = re.findall(r'(\b20\d{2}\b)\s*[-–]\s*(\b20\d{2}\b)', text)
    if ranges:
        try:
            start, end = ranges[0]
            return float(int(end) - int(start))
        except:
            pass
    return 0.0

def skill_overlap_score(resume_skills: List[str], jd_skills: List[str]) -> Tuple[int, int, float]:
    rs = set([s.lower().strip() for s in resume_skills])
    jd = set([s.lower().strip() for s in jd_skills])
    matched = rs.intersection(jd)
    pct = 0 if len(jd) == 0 else round((len(matched) / len(jd)) * 100, 1)
    return len(matched), len(jd), pct

def tfidf_similarity_score(resume_text: str, jd_text: str) -> float:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    corpus = [clean_text(resume_text), clean_text(jd_text)]
    vect = TfidfVectorizer(stop_words="english", max_features=5000)

    try:
        tfidf = vect.fit_transform(corpus)
    except:
        return 0.0

    sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    return round(sim * 100, 1)

def extract_top_keywords(text: str, n=25) -> List[str]:
    tok = tokens(text)
    c = Counter(tok)
    filtered = [w for w, _ in c.most_common(n * 3) if len(w) > 2]
    return filtered[:n]

def analyze_advanced_ats(resume_text: str,
                         resume_skills: List[str],
                         jd_text: str = "") -> Dict[str, Any]:

    jd_clean = clean_text(jd_text)
    jd_skills = extract_top_keywords(jd_clean, n=20)

    matched, total, overlap_pct = skill_overlap_score(resume_skills, jd_skills)
    tfidf_pct = tfidf_similarity_score(resume_text, jd_clean)
    exp_years = estimate_experience_years(resume_text)

    rs = set([s.lower() for s in resume_skills])
    missing = [s for s in jd_skills if s.lower() not in rs]

    experience_score = min(exp_years / 5, 1.0) * 100

    composite = round(
        (overlap_pct * 0.5) +
        (tfidf_pct * 0.3) +
        (experience_score * 0.2),
        1
    )

    return {
        "skill_overlap_pct": overlap_pct,
        "tfidf_similarity_pct": tfidf_pct,
        "experience_years": exp_years,
        "missing_skills": missing[:6],
        "ats_score": composite,
        "jd_skills_extracted": jd_skills
    }
