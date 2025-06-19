"use client";

import Link from "next/link";
import { BookOpen, Clock, ChevronRight } from "lucide-react"; // Removed Star as it's not in this card's data
import React from "react";

// Define the shape of the interview prop for this card
// This should align with the Interview type used in MyInterviews page
interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  created_at: string;
  finalized?: boolean; // Field used to determine 'Completed' or 'In Progress'
  // Add other fields from the Interview type if needed for display
}

interface MyInterviewCardProps {
  interview: Interview;
}

const MyInterviewCard: React.FC<MyInterviewCardProps> = ({ interview }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{interview.role}</h3>
          <p className="text-sm text-gray-600">{interview.type}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          interview.finalized
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {interview.finalized ? 'Completed' : 'In Progress'}
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
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {interview.finalized ? (
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
            Continue Interview
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

export default React.memo(MyInterviewCard);
