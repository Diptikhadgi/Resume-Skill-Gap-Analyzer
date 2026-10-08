# Resume Skill Gap Analyzer

A web application that analyzes a candidate's resume, extracts skills, and compares them with a selected job role to identify skill gaps.

## Features
- Upload a PDF resume and extract skills automatically
- Compare extracted skills with required skills for a chosen job role
- Skill gap detection and resume scoring (ATS-style)
- Role and skill recommendations based on the resume

## Tech Stack
- **Frontend:** React.js, Firebase
- **Backend:** Python, Flask
- **Data:** JSON-based job role dataset

## Project Structure
```
backend/    Flask API (resume parsing, skill matching, ATS scoring, recommender)
frontend/   React app (UI, resume upload, results display)
```

## How to Run

### Backend
```
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```
cd frontend
npm install
npm start
```

## Author
Dipti Khadgi
