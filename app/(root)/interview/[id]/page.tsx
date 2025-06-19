"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Mic, Brain, Clock, Lightbulb } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { use } from "react";
import Link from "next/link";
import { ChevronLeft, Star, MessageSquare, CheckCircle, XCircle } from "lucide-react";
// import Footer from "@/components/Footer"; // To be lazy loaded
import { Interview, InterviewAttempt } from "@/types/interview"; // Assuming Interview type is compatible
// Removed: import { getMyFeedbackForInterview, getInterviewById } from "@/lib/actions/general.action";
import { request, getAccessToken } from "@/lib/apiClient"; // Import apiClient functions

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";
import React, { Suspense } from "react";
import InterviewHeader from "@/components/interview/InterviewHeader";
import SkeletonInterviewHeader from "@/components/interview/skeletons/SkeletonInterviewHeader";
import SkeletonAgentArea from "@/components/interview/skeletons/SkeletonAgentArea";
import SkeletonSidebarCard from "@/components/interview/skeletons/SkeletonSidebarCard";

const Footer = React.lazy(() => import("@/components/Footer"));
const InterviewTipsSidebar = React.lazy(() => import("@/components/interview/InterviewTipsSidebar"));
const ProgressSidebar = React.lazy(() => import("@/components/interview/ProgressSidebar"));

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function InterviewDetails({ params, searchParams }: PageProps): React.ReactElement {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Group all useState hooks together
  const [interview, setInterview] = useState<Interview | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Group all useMemo hooks together
  const imageSrc = useMemo(() => interview?.cover_image || getRandomInterviewCover(), [interview?.cover_image]);
  
  const displayType = useMemo(() => {
    if (!interview?.type) return "Technical";
    const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;
    return normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1).toLowerCase();
  }, [interview?.type]);

  const typeBadgeColor = useMemo(() => ({
    Behavioral: "bg-violet-100 text-violet-700",
    Mixed: "bg-yellow-100 text-yellow-700",
    Technical: "bg-blue-100 text-blue-700",
  }[displayType] || "bg-violet-100 text-violet-700"), [displayType]);

  const displayLevel = useMemo(() => (
    interview?.level
      ? interview.level.charAt(0).toUpperCase() + interview.level.slice(1).toLowerCase()
      : "Beginner"
  ), [interview?.level]);

  const levelBadgeColor = useMemo(() => ({
    "entry level": "bg-emerald-100 text-emerald-700",
    beginner: "bg-teal-100 text-teal-700",
    junior: "bg-lime-100 text-lime-700",
    intermediate: "bg-amber-100 text-amber-700",
    senior: "bg-orange-100 text-orange-700",
    advanced: "bg-sky-100 text-sky-700",
    expert: "bg-indigo-100 text-indigo-700",
  }[displayLevel.toLowerCase()] || "bg-green-100 text-green-700"), [displayLevel]);

  const agentQuestions = useMemo(() => interview?.questions || [], [interview?.questions]);

  // Keep useEffect after all other hooks
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) {
        setIsLoadingData(false);
        if (!user && !authLoading) router.push("/sign-in");
        return;
      }
      setIsLoadingData(true);
      setFetchError(null);
      try {
        const accessToken = getAccessToken();
        if (!accessToken) {
          console.error("No access token found for fetching interview data.");
          setFetchError("Authentication required to view this page.");
          setIsLoadingData(false);
          router.push("/sign-in");
          return;
        }

        const interviewData = await request("GET", `/acharya_ai/interviews/${id}`);
        if (!interviewData) {
          setFetchError("Interview not found or could not be loaded.");
          setInterview(null);
          setIsLoadingData(false);
          return;
        }
        setInterview(interviewData);

        const feedbackData = await request("GET", `/acharya_ai/interviews/${id}/feedback`);
        setFeedback(feedbackData);
      } catch (error: any) {
        console.error("Error fetching interview data:", error.message);
        setFetchError(error.message || "Failed to load interview data. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!authLoading && id) {
      fetchData();
    }
  }, [id, user, authLoading, router]);

  // Initial global loading (auth check)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  // After auth, if still loading data, show skeletons
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <SkeletonInterviewHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <SkeletonAgentArea />
            </div>
            <div className="space-y-6">
              <SkeletonSidebarCard />
              <SkeletonSidebarCard />
            </div>
          </div>
        </div>
        {/* Footer skeleton can be simple text or omitted for main content loading */}
        <div className="text-center py-4 text-gray-400">Loading footer...</div>
      </div>
    );
  }

  // If fetch error occurred
  if (fetchError && !interview) { // Show error prominently if interview could not be loaded at all
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-red-500 mb-6">{fetchError}</p>
        <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
          Go to Dashboard
        </Link>
        <div className="mt-auto w-full max-w-7xl mx-auto px-4 py-8">
          <Suspense fallback={<div>Loading footer...</div>}>
            <Footer />
          </Suspense>
        </div>
      </div>
    );
  }

  // If no user (should be caught by authLoading or redirect) or no interview after loading & no major fetchError
  if (!user || !interview) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow flex items-center justify-center"> {/* Centered content */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {fetchError || "Interview not found."} {/* Show fetchError if it exists but interview is also null */}
            </h1>
            <Link
              href="/my-interviews"
              className="text-primary-600 hover:text-primary-700"
            >
              Back to My Interviews
            </Link>
          </div>
        </main>
        <Suspense fallback={<div>Loading footer...</div>}>
          <Footer />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InterviewHeader
          role={interview.role}
          imageSrc={imageSrc}
          questionCount={agentQuestions?.length || 0}
          displayLevel={displayLevel}
          levelBadgeColor={levelBadgeColor}
          displayType={displayType}
          typeBadgeColor={typeBadgeColor}
          techstack={interview.techstack}
        />

        {/* Interview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interview Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Agent
                userName={user?.username || ""}
                userId={user?.id}
                userAvatar={user?.photoURL}
                interviewId={id}
                type="interview"
                questions={agentQuestions}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Suspense fallback={<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">Loading Tips...</div>}>
              <InterviewTipsSidebar />
            </Suspense>

            <Suspense fallback={<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">Loading Progress...</div>}>
              <ProgressSidebar feedback={feedback} />
            </Suspense>
          </div>
        </div>
      </div>
      {/* Footer is rendered by the parent layout or here if this is the outermost component */}
      {/* For this refactor, assuming Footer is part of this page's structure and needs Suspense */}
      <Suspense fallback={<div>Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}
