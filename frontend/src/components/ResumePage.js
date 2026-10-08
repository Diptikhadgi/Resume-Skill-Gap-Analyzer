import React, { useState } from "react";
import "./ResumePage.css"; // styling ko alag CSS file me rakhenge

const ResumePage = () => {
  const [resumeData, setResumeData] = useState({
    name: "OJAS KIDILAY",
    email: "ojaskidilay04@gmail.com",
    phone: "7276125435",
    skills: ["python", "numpy", "machine learning", "javascript", "html", "css", "pandas"],
    missing: ["deep learning", "statistics"],
  });

  return (
    <div className="container">
      <header>
        <div className="logo">RA</div>
        <div>
          <h1>Resume Skill Gap Analyzer</h1>
          <p className="lead">
            Beautiful, quick and clear resume insights — ready to share with candidates.
          </p>
        </div>
      </header>

      <div className="grid">
        <main className="card">
          {/* Upload Section */}
          <div className="upload">
            <div className="select card" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label htmlFor="job">Role</label>
              <select id="job">
                <option>Data Scientist</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Machine Learning Engineer</option>
              </select>
            </div>

            <div className="file-input">
              <label className="btn-ghost" htmlFor="resume">Choose File</label>
              <input id="resume" type="file" accept=".pdf,.doc,.docx" />
              <button className="btn-primary">Analyze</button>
            </div>
          </div>

          {/* Profile Section */}
          <section className="profile">
            <div className="avatar">{resumeData.name.split(" ").map(s => s[0]).slice(0,2).join("")}</div>
            <div className="meta">
              <h2>{resumeData.name}</h2>
              <p>{resumeData.email}</p>
              <p>{resumeData.phone}</p>
              <div className="badges">
                {resumeData.skills.map((s, i) => (
                  <div key={i} className="badge">{s}</div>
                ))}
              </div>
            </div>
          </section>

          <hr />

          {/* Suggestion */}
          <div className="suggestion">
            <strong>Suggestions:</strong>
            <p>
              To improve as a data scientist, work on: {resumeData.missing.join(", ")}
            </p>
          </div>

          <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn-primary">Download Report</button>
            <button className="select">Preview PDF</button>
            <button className="select">Clear</button>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="card">
            <h3 style={{ color: "white", marginTop: 0 }}>Quick Summary</h3>
            <div className="stat">
              <div>
                <div className="num">{resumeData.skills.length}</div>
                <div className="label">Skills Found</div>
              </div>
              <div style={{ fontSize: "20px" }}>🔍</div>
            </div>
            <div className="stat">
              <div>
                <div className="num">{resumeData.missing.length}</div>
                <div className="label">Missing Skills</div>
              </div>
              <div style={{ fontSize: "20px" }}>⚠️</div>
            </div>

            <h4 style={{ color: "white" }}>Missing Skills</h4>
            <div>
              {resumeData.missing.map((m, i) => (
                <div key={i} className="badge missing">{m}</div>
              ))}
            </div>

            <h4 style={{ color: "white", marginTop: "12px" }}>Actions</h4>
            <div className="actions">
              <button className="btn">Share</button>
              <button className="btn">Save</button>
            </div>
          </div>
        </aside>
      </div>

      <footer>
        Tip: Use <span className="kbd">Download Report</span> to get a shareable PDF. Try different job roles to see updated suggestions.
      </footer>
    </div>
  );
};

export default ResumePage;
