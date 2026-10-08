import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import "chart.js/auto";
import "./App.css";

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================================
  // HANDLE FILE UPLOAD
  // ================================
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/upload?job_role=${encodeURIComponent(jobRole)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResumeData(data);
        setError("");
      } else {
        setResumeData(null);
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("⚠️ Failed to connect to backend.");
      setResumeData(null);
    }

    setLoading(false);
  };

  // ================================
  // CHART DATA
  // ================================
  const chartData = {
    labels: ["Skills Found", "Missing Skills"],
    datasets: [
      {
        data: [
          resumeData?.skills?.length || 0,
          resumeData?.missing_skills?.length || 0,
        ],
        backgroundColor: ["#4CAF50", "#FF5252"],
      },
    ],
  };

  // ================================
  // ATS SCORE CALCULATION
  // ================================
  const ats_total_required =
    (resumeData?.skills?.length || 0) + (resumeData?.missing_skills?.length || 0);

  // Use backend ATS if exists, otherwise calculate
  const ats_score =
    resumeData?.ats_score ??
    (ats_total_required === 0
      ? 0
      : Math.round(
          ((resumeData?.skills?.length || 0) / ats_total_required) * 100
        ));

  const ats_matched_count = resumeData?.skills?.length || 0;
  const ats_total = ats_total_required || 0;
  const checked_role = resumeData?.job_role_checked || jobRole || "selected role";

  // ================================
  // DOWNLOAD PDF
  // ================================
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Resume Skill Gap Analysis Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${resumeData.name || "N/A"}`, 20, 40);
    doc.text(`Email: ${resumeData.email || "N/A"}`, 20, 50);
    doc.text(`Phone: ${resumeData.phone || "N/A"}`, 20, 60);
    doc.text(`Skills Found: ${resumeData.skills?.join(", ") || "None"}`, 20, 70);
    doc.text(
      `Missing Skills: ${resumeData.missing_skills?.join(", ") || "None"}`,
      20,
      80
    );
    doc.text(`ATS Score: ${ats_score}%`, 20, 90);
    doc.text(`Suggestions: ${resumeData.suggestions || "None"}`, 20, 100);

    doc.save("Resume_Analysis.pdf");
  };

  // ================================
  // UI
  // ================================

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}>
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 shadow bg-indigo-600 text-white">
        <h1 className="text-xl font-bold">🚀 Resume Analyzer</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 bg-white text-indigo-600 rounded-lg font-medium shadow"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-6">
            Resume Skill Gap Analyzer
          </h2>

          {/* JOB ROLE */}
          <select
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Select Job Role --</option>
            <option value="data scientist">Data Scientist</option>
            <option value="frontend developer">Frontend Developer</option>
            <option value="backend developer">Backend Developer</option>
            <option value="ai engineer">AI Engineer</option>
          </select>

          {/* FILE UPLOAD */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="w-full mb-4 p-3 border rounded-lg"
          />

          {/* LOADING SPINNER */}
          {loading && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* RESULT SECTION */}
          {resumeData && (
            <motion.div
              className="bg-gray-50 dark:bg-gray-700 border rounded-lg p-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div><strong>Name:</strong> {resumeData.name || "N/A"}</div>
              <div><strong>Email:</strong> {resumeData.email || "N/A"}</div>
              <div><strong>Phone:</strong> {resumeData.phone || "N/A"}</div>

              <div>
                <strong>Skills Found:</strong>{" "}
                {resumeData.skills?.length > 0 ? resumeData.skills.join(", ") : "None"}
              </div>

              <div>
                <strong>Missing Skills:</strong>{" "}
                {resumeData.missing_skills?.length > 0 ? resumeData.missing_skills.join(", ") : "None"}
              </div>

              <div>
                <strong>Suggestions:</strong> {resumeData.suggestions || "No suggestions"}
              </div>

              {/* ================================
                  ATS SCORE UI  
              ================================ */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-200">
                  ATS Score
                </h3>

                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-2 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-green-400 dark:bg-green-500 transition-all"
                    style={{ width: `${ats_score}%` }}
                  />
                </div>

                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {ats_score}% match for <span className="font-semibold">{checked_role}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ({ats_matched_count} / {ats_total} skills matched)
                </p>

                {/* CIRCULAR RING */}
                <div className="flex justify-center mt-4">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="transparent" />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#34D399"
                        strokeWidth="12"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * ats_score) / 100}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-indigo-700 dark:text-indigo-200">
                        {ats_score}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PIE CHART */}
              <div className="my-4">
                <Pie data={chartData} />
              </div>

              {/* DOWNLOAD PDF */}
              <button
                onClick={downloadPDF}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
              >
                📄 Download Report
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="text-center py-4 bg-indigo-600 text-white"></footer>
    </div>
  );
}

export default App;
