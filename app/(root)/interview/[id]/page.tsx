"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Mic, Brain, Clock, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { use } from "react";
import Link from "next/link";
import { ChevronLeft, Star, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { Interview, InterviewAttempt } from "@/types/interview";
import { getMyFeedbackForInterview, getInterviewById } from "@/lib/actions/general.action";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function InterviewDetails({ params, searchParams }: PageProps): React.ReactElement {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading } = useAuth();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const accessToken = localStorage.getItem('access_token');
        const interviewData = await getInterviewById(id, accessToken);
        if (!interviewData) {
          router.push("/");
          return;
        }
        setInterview(interviewData);
        console.log("Interview Data", interviewData);

        const feedbackData = await getMyFeedbackForInterview(id, accessToken);
        setFeedback(feedbackData);
      } catch (error) {
        console.error("Error fetching interview data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [id, user, loading, router]);

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

  // Use the interview's coverImage if available, otherwise get a random one
  const imageSrc = interview.cover_image || getRandomInterviewCover();

  // Normalize the interview type for consistent badge styling
  const normalizedType = /mix/gi.test(interview.type)
    ? "Mixed"
    : interview.type;

  // Ensure the type always starts with a capital letter
  const displayType =
    normalizedType.charAt(0).toUpperCase() +
    normalizedType.slice(1).toLowerCase();

  // Type badge color mapping
  const typeBadgeColor =
    {
      Behavioral: "bg-violet-100 text-violet-700",
      Mixed: "bg-yellow-100 text-yellow-700",
      Technical: "bg-blue-100 text-blue-700",
    }[displayType] || "bg-violet-100 text-violet-700";

  // Level badge color mapping
  const levelBadgeColor =
    {
      "entry level": "bg-emerald-100 text-emerald-700",
      beginner: "bg-teal-100 text-teal-700",
      junior: "bg-lime-100 text-lime-700",
      intermediate: "bg-amber-100 text-amber-700",
      senior: "bg-orange-100 text-orange-700",
      advanced: "bg-sky-100 text-sky-700",
      expert: "bg-indigo-100 text-indigo-700",
    }[interview.level?.toLowerCase() || "beginner"] ||
    "bg-green-100 text-green-700";

  // Capitalize the first letter of the level for display
  const displayLevel = interview.level
    ? interview.level.charAt(0).toUpperCase() +
      interview.level.slice(1).toLowerCase()
    : "Beginner";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={imageSrc}
                  alt="cover-image"
                  width={80}
                  height={80}
                  className="rounded-xl object-cover size-[80px]"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                  <div className="bg-primary-600 rounded-full p-1">
                    <Image
                      src="/globe.svg"
                      width={20}
                      height={20}
                      alt="microphone"
                      className="text-white"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 capitalize">
                  {interview.role} Interview
                </h3>
                <p className="text-gray-600 mt-1">
                  Get ready for your interview session
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-10 px-4 py-2 rounded-full">
                <Image
                  src="/question.svg"
                  width={20}
                  height={20}
                  alt="questions"
                />
                <span className="text-gray-700 bg-sky-550 font-medium">
                  {interview.questions?.length || 0} questions
                </span>
              </div>

              <div className="flex gap-2">
                {/* Level badge */}
                <span
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    levelBadgeColor,
                  )}
                >
                  {displayLevel}
                </span>

                {/* Type badge */}
                <span
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium",
                    typeBadgeColor,
                  )}
                >
                  {displayType}
                </span>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {interview.techstack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

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
                questions={interview.questions}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interview Tips */}
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

            {/* Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Your Progress
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Previous Score</span>
                  <span className="text-primary-600 font-semibold">
                    {feedback?.totalScore || "N/A"}/100
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attempts</span>
                  <span className="text-gray-900 font-semibold">
                    {feedback ? "1" : "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
