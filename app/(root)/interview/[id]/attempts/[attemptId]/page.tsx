"use client";

import { use } from "react";
import { getInterviewById } from "@/lib/actions/general.action";
import Link from "next/link";
import { ChevronLeft, Star, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { Feedback } from "@/types";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ id: string; attemptId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function InterviewAttempts({ params, searchParams }: PageProps) {
  const { id, attemptId } = use(params);
  const { user, loading } = useAuth();
  const [interview, setInterview] = useState<any>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const accessToken = localStorage.getItem('access_token');
        const interviewData = await getInterviewById(id, accessToken);
        if (!interviewData) {
          return;
        }
        setInterview(interviewData);

        // Find the specific feedback
        const feedbackData = interviewData.feedbacks?.find((f: Feedback) => f.id === attemptId);
        setFeedback(feedbackData || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [id, attemptId, user, loading]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !interview) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Interview not found</h1>
              <Link
                href="/my-interviews"
                className="text-primary-600 hover:text-primary-700"
              >
                Back to My Interviews
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Feedback not found</h1>
              <Link
                href={`/interview/${interview.id}/attempts`}
                className="text-primary-600 hover:text-primary-700"
              >
                Back to Attempts
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/interview/${interview.id}/attempts`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Attempts
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {interview.role} - {interview.type}
                </h1>
                <p className="text-gray-600">{interview.techstack.join(', ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-yellow-600">
                  <Star className="h-5 w-5" />
                  <span className="font-semibold text-xl">{feedback.total_score || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attempt Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Scores */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Category Scores</h2>
              {feedback.category_scores.map((category: { name: string; score: number }, index: number) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-5 w-5" />
                      <span className="font-semibold text-xl">{category.score}/100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">Detailed Feedback</span>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">{feedback.final_assessment}</p>
              </div>

              {/* Improvement Suggestions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Areas for Improvement</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Strengths</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {feedback.strengths.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Areas to Focus On</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {feedback.areas_for_improvement.map((area: string, index: number) => (
                          <li key={index}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}