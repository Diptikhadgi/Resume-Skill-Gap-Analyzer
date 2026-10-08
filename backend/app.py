from flask import Flask, request, jsonify
from flask_cors import CORS
from parse_resume import extract_resume_data
import os

app = Flask(__name__)
CORS(app)  # ✅ allow React frontend requests

# Upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'data', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_resume():
    # ✅ file check
    if 'resume' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'Empty file name'}), 400

    # ✅ save file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # ✅ job_role frontend se lo
    job_role = request.args.get("job_role", "").lower()

    try:
        # ✅ extract_resume_data ko job_role ke saath call
        data = extract_resume_data(file_path, job_role=job_role)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return "✅ Flask server is running!"

if __name__ == '__main__':
    app.run(debug=True)