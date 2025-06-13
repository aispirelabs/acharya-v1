"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { getMyInterviews } from "@/lib/actions/general.action";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Clock } from "lucide-react";
import Footer from "@/components/Footer";
import { Interview } from "@/types/interview";

export default function MyInterviews() {
  const { user, loading } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) return;

      try {
        const accessToken = localStorage.getItem('access_token');
        const interviewsData = await getMyInterviews(accessToken);
        if (interviewsData) {
          setInterviews(interviewsData);
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchInterviews();
    }
  }, [user, loading]);

  const totalPages = Math.ceil((interviews?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInterviews = interviews?.slice(startIndex, endIndex) || [];

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
          </div>

          {/* Interviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentInterviews.map((interview) => (
              <div key={interview.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 
