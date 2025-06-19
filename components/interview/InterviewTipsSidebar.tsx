"use client";

import React from "react";
import { Mic, Brain, Clock, Lightbulb } from "lucide-react";

const InterviewTipsSidebar: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Interview Tips
      </h4>
      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <div className="bg-primary-100 rounded-full p-1.5 mt-1">
            <Mic className="h-4 w-4 text-primary-600" />
          </div>
          <p className="text-gray-600">
            Speak clearly and at a moderate pace
          </p>
        </li>
        <li className="flex items-start gap-3">
          <div className="bg-primary-100 rounded-full p-1.5 mt-1">
            <Clock className="h-4 w-4 text-primary-600" />
          </div>
          <p className="text-gray-600">
            Take a moment to think before answering
          </p>
        </li>
        <li className="flex items-start gap-3">
          <div className="bg-primary-100 rounded-full p-1.5 mt-1">
            <Lightbulb className="h-4 w-4 text-primary-600" />
          </div>
          <p className="text-gray-600">
            Provide specific examples from your experience
          </p>
        </li>
        <li className="flex items-start gap-3">
          <div className="bg-primary-100 rounded-full p-1.5 mt-1">
            <Brain className="h-4 w-4 text-primary-600" />
          </div>
          <p className="text-gray-600">
            Be honest about your knowledge and experience
          </p>
        </li>
      </ul>
    </div>
  );
};

export default React.memo(InterviewTipsSidebar);
