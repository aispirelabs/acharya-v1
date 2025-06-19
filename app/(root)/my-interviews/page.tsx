"use client";

import React, { useEffect, useState, Suspense } from "react"; // Added React, Suspense
import { useAuth } from "@/lib/context/AuthContext";
// Removed: import { getMyInterviews } from "@/lib/actions/general.action";
import { request, getAccessToken } from "@/lib/apiClient"; // Added apiClient imports
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Clock } from "lucide-react";
// Removed: import Footer from "@/components/Footer";
import MyInterviewCard from "@/components/MyInterviewCard";
import { Interview } from "@/types/interview";
import SkeletonCard from "@/components/SkeletonCard"; // Import SkeletonCard

const Footer = React.lazy(() => import("@/components/Footer"));

export default function MyInterviews() {
  const { user, loading: authLoading } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [interviewsError, setInterviewsError] = useState<string | null>(null); // Added error state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Display up to 9 cards per page

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) {
        setIsLoading(false); // Not loading if no user
        return;
      }
      setIsLoading(true); // Set loading true before fetch
      try {
        const accessToken = getAccessToken(); // Use apiClient
        if (!accessToken) {
            console.log("No access token, cannot fetch interviews.");
            setInterviews([]); // Clear interviews if no token
            setIsLoading(false);
            return;
        }
        // Assuming '/interviews/my/' is the endpoint for user's interviews
        const interviewsData = await request("GET", "/acharya_ai/interviews/");
        if (interviewsData && Array.isArray(interviewsData)) {
          setInterviews(interviewsData);
          setInterviewsError(null); // Clear error on success
        } else {
          setInterviews([]);
          // Consider setting an error if data is not array and not explicitly null/empty for "no interviews"
          // For now, assuming API contract is an array or error.
        }
      } catch (error: any) {
        console.error("Error fetching interviews:", error.message);
        setInterviewsError("Failed to load your interviews. Please try again later.");
        setInterviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) { // Only fetch when auth state is resolved
      fetchInterviews();
    }
  }, [user, authLoading]);

  const totalPages = Math.ceil((interviews?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInterviews = interviews?.slice(startIndex, endIndex) || [];

  // Initial global loading (auth check)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading your session...
          </p>
        </div>
      </div>
    );
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

          {/* Interviews Grid - Now handles isLoading, error, empty, and data states */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(itemsPerPage)].map((_, index) => ( // Show skeleton cards based on itemsPerPage
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : interviewsError ? (
            <div className="text-center py-10 text-red-500 bg-red-50 border border-red-200 rounded-lg p-6">
              <p>{interviewsError}</p>
              {/* Optionally, add a retry button here */}
            </div>
          ) : currentInterviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-100 rounded-lg p-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">No interviews found.</h2>
              <p className="text-sm sm:text-base">Start by creating a new interview in your dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentInterviews.map((interview) => (
                <MyInterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          )}

          {/* Pagination - only show if there are interviews and more than one page */}
          {interviews.length > 0 && totalPages > 1 && (
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
      <Suspense fallback={<div>Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}
