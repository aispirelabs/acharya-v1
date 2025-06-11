import { getInterviewById } from "@/lib/actions/general.action";
import Link from "next/link";
import { ChevronLeft, Star, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { Interview, InterviewAttempt } from "@/types/interview";

export default async function InterviewAttempts({
  params,
  searchParams,
}: {
  params: { id: string; attemptId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { id, attemptId } = params;
  const { page: pageStr, limit: limitStr } = searchParams || {};
  console.log(pageStr, limitStr);
  // const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview) {
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

  const interviewTyped = interview as Interview;
  const attempt = interviewTyped.attempts?.find((a: InterviewAttempt) => a.id === attemptId);

  if (!attempt) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Attempt not found</h1>
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
                  <span className="font-semibold text-xl">{attempt.score || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attempt Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Questions and Answers */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Questions & Answers</h2>
              {attempt.answers?.map((qa: { question: string; answer: string }, index: number) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Question {index + 1}
                  </h3>
                  <p className="text-gray-700 mb-4">{qa.question}</p>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 whitespace-pre-wrap">{qa.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
              {attempt.feedback ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <MessageSquare className="h-5 w-5" />
                    <span className="font-medium">Detailed Feedback</span>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{attempt.feedback}</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <p className="text-gray-600">No feedback available for this attempt.</p>
                </div>
              )}

              {/* Improvement Suggestions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Areas for Improvement</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Strengths</p>
                      <p className="text-gray-600">Your technical knowledge and problem-solving approach were strong.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Areas to Focus On</p>
                      <p className="text-gray-600">Consider improving your code organization and documentation.</p>
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