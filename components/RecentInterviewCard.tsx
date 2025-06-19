"use client";

import Link from "next/link";
import { BookOpen, Clock, Star, ChevronRight } from "lucide-react";
import React from "react";

// Define the shape of the interview prop
interface InterviewFeedback {
  total_score: number;
  // Add other feedback properties if available and needed
}

interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  created_at: string;
  feedbacks?: InterviewFeedback[]; // Make feedbacks optional as per usage
}

interface RecentInterviewCardProps {
  interview: Interview;
}

const RecentInterviewCard: React.FC<RecentInterviewCardProps> = ({ interview }) => {
  const feedback = interview.feedbacks?.[0]; // Get the first feedback if available

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{interview.role}</h3>
          <p className="text-sm text-gray-600">{interview.type}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          feedback
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {feedback ? 'Completed' : 'Not Started'}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="h-4 w-4" />
          <span>{interview.techstack.join(", ")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{new Date(interview.created_at).toLocaleDateString()}</span>
        </div>
        {feedback && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Score: {feedback.total_score}/100</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {feedback ? (
          <Link
            href={`/interview/${interview.id}/feedback`}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View Feedback
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href={`/interview/${interview.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            Start Interview
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
        <Link
          href={`/interview/${interview.id}/attempts`}
          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
        >
          View Attempts
        </Link>
      </div>
    </div>
  );
};

export default React.memo(RecentInterviewCard);
