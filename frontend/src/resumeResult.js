import React from 'react';

const ResumeResult = ({ data }) => {
  if (!data) {
    return <p className="text-gray-500">No resume data available.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Resume Analysis Result</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {data.name || "Not found"}</p>
        <p><strong>Email:</strong> {data.email || "Not found"}</p>
        <p><strong>Phone:</strong> {data.phone || "Not found"}</p>
        <p><strong>Skills Found:</strong> {(data.skills || []).join(', ') || "None"}</p>
        <p><strong>Missing Skills:</strong> {(data.missing_skills || []).join(', ') || "None"}</p>
        <p><strong>Suggestions:</strong> {data.suggestions || "No suggestions available"}</p>
      </div>
    </div>
  );
};

export default ResumeResult;
