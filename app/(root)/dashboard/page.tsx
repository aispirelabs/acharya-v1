"use client";

import React, { useEffect, useState, Suspense } from "react"; // Import Suspense and React
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
// import Footer from "@/components/Footer"; // To be lazy loaded
import Link from "next/link";
import { ArrowRight, BarChart, BookOpen, Clock, Star, ChevronRight } from "lucide-react";
import { getLatestPublicInterviews, getMyFeedbackForInterview } from "@/lib/actions/general.action"; // Assuming this is okay for now
// import InterviewFormDialog from "@/components/interview/InterviewFormDialog"; // To be lazy loaded
import RecentInterviewCard from "@/components/RecentInterviewCard";
import { getAccessToken } from "@/lib/apiClient";
import SkeletonCard from "@/components/SkeletonCard"; // Import SkeletonCard

// Lazy load components
const Footer = React.lazy(() => import("@/components/Footer"));
const InterviewFormDialog = React.lazy(() => import("@/components/interview/InterviewFormDialog"));


interface InterviewFeedback { // Define InterviewFeedback if not already globally available
  total_score: number;
}
interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  created_at: string;
  feedbacks?: InterviewFeedback[]; // Ensure this matches RecentInterviewCard
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);
  const [interviewsError, setInterviewsError] = useState<string | null>(null); // Added error state
  // const accessToken = localStorage.getItem('access_token'); // Replaced


  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchInterviews = async () => {
      const accessToken = getAccessToken(); // Use apiClient function
      if (!accessToken && user) { // Ensure we only fetch if token (implicitly user) is available
          console.log("No access token found, cannot fetch interviews.");
          setIsLoadingInterviews(false);
          return;
      }
      try {
        // Pass token if required by the action, otherwise, the action might handle it
        const interviews = await getLatestPublicInterviews(accessToken);
        if (interviews) {
          setRecentInterviews(interviews);
          setInterviewsError(null); // Clear error on success
        } else {
          // Handle case where API returns success but no interviews (e.g. empty array)
          setRecentInterviews([]);
        }
      } catch (error: any) {
        console.error("Error fetching interviews:", error);
        setInterviewsError("Failed to load recent interviews. Please try again later.");
        setRecentInterviews([]); // Clear interviews on error
      } finally {
        setIsLoadingInterviews(false);
      }
    };

    if (user) { // Only fetch if user object is present
      fetchInterviews();
    } else if (!loading && !user) { // If not loading and no user, don't attempt to fetch
      setIsLoadingInterviews(false);
    }
  }, [user, loading]); // Added loading to dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <section className="relative py-16 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 text-white mb-12">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative max-w-3xl mx-auto text-center px-4">
              {/* Responsive font size for hero title */}
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Welcome back, {user?.first_name || user?.username}! 👋
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Track your learning progress and continue your journey to mastery
              </p>
              <div className="flex items-center justify-center gap-4">
                <Suspense fallback={<div className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-xl font-medium opacity-50 cursor-not-allowed">Loading...</div>}>
                  <InterviewFormDialog />
                </Suspense>
                <Link
                  href="/my-interviews"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  View All Interviews
                  <BarChart className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Recent Interviews Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Interviews
              </h2>
              <Link
                href="/my-interviews"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {isLoadingInterviews ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Display 3 skeleton cards */}
                {[...Array(3)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : interviewsError ? (
              <div className="text-center py-8 text-red-500 bg-red-50 border border-red-200 rounded-lg p-6">
                <p>{interviewsError}</p>
              </div>
            ) : recentInterviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentInterviews.map(interview => (
                  <RecentInterviewCard key={interview.id} interview={interview} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">No interviews yet!</h3>
                <p>Start by creating a new interview to see it here.</p>
              </div>
            )}
          </section>

        </div>
      </main>

      <Suspense fallback={<div>Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}