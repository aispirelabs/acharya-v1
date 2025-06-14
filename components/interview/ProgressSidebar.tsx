"use client";

import React from "react";

interface Feedback {
  totalScore?: number;
  total_score?: number; // For flexibility with property naming
  attempt_count?: number;
  // Add any other relevant feedback properties
}

interface ProgressSidebarProps {
  feedback: Feedback | null | undefined;
}

const ProgressSidebar: React.FC<ProgressSidebarProps> = ({ feedback }) => {
  const score = feedback?.totalScore || feedback?.total_score;
  // Determine attempts: if feedback exists, assume at least 1 attempt, or use attempt_count if available.
  const attempts = feedback ? (feedback.attempt_count || 1) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Your Progress
      </h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Previous Score</span>
          <span className="text-primary-600 font-semibold">
            {score !== undefined ? `${score}/100` : "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Attempts</span>
          <span className="text-gray-900 font-semibold">
            {attempts}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProgressSidebar);
