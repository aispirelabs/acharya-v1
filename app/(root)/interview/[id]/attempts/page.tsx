import {
  getInterviewById,
  getFeedbacksByInterviewId,
} from "@/lib/actions/general.action";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, MessageSquare } from "lucide-react";
import Footer from "@/components/Footer";
import { Feedback } from "@/types";
// import { Interview, InterviewAttempt } from "@/types/interview";

export default async function InterviewAttempts({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const { page: pageStr, limit: limitStr } = resolvedSearchParams || {};

  // const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  // Pagination
  const page = Number(pageStr) || 1;
  const limit = Number(limitStr) || 5;
  const offset = (page - 1) * limit;

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Interview not found
          </h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get all feedbacks for this interview with pagination
  const feedbacks = (await getFeedbacksByInterviewId(id, {
    limit,
    offset,
  })) as Feedback[];
  const totalFeedbacks = (await getFeedbacksByInterviewId(id, {
    countOnly: true,
  })) as number;
  const totalPages = Math.ceil(totalFeedbacks / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href={`/`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          <Link
            href={`/interview/${id}`}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retake Interview
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Interview Feedback History
          </h1>

          {feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No feedback has been generated yet.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {feedbacks.map((feedback, index) => (
                  <div
                    key={feedback.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Feedback {totalFeedbacks - (offset + index)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="h-5 w-5" />
                          <span className="font-semibold">
                            {feedback.totalScore}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category Scores */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Category Scores</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {feedback.categoryScores.map(
                          (
                            category: { name: string; score: number },
                            idx: number,
                          ) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center"
                            >
                              <span className="text-gray-600">
                                {category.name}
                              </span>
                              <span className="font-medium text-gray-900">
                                {category.score}/100
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Final Assessment */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Final Assessment</span>
                      </div>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {feedback.finalAssessment}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/interview/${feedback.interviewId}/feedback?feedbackId=${feedback.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                      >
                        View Full Feedback
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  {page > 1 && (
                    <Link
                      href={`/interview/${id}/attempts?page=${page - 1}&limit=${limit}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  <span className="text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/interview/${id}/attempts?page=${page + 1}&limit=${limit}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
