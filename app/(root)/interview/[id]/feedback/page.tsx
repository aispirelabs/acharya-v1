"use client";

import { use } from "react";
import { getInterviewById, getMyFeedbackForInterview } from "@/lib/actions/general.action";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Feedback } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ feedbackId?: string }>;
}

export default function FeedbackPage({ params, searchParams }: PageProps) {
  const { id } = use(params);
  const resolvedSearchParams = use(searchParams);
  const { feedbackId } = resolvedSearchParams;
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

        // Get feedback for this interview
        const feedbacksData = await getMyFeedbackForInterview(id, accessToken);
        if (feedbacksData && feedbacksData.length > 0) {
          // If feedbackId is provided in searchParams, find that specific feedback
          if (feedbackId) {
            const specificFeedback = feedbacksData.find(f => f.id === feedbackId);
            if (specificFeedback) {
              setFeedback(specificFeedback);
            }
          } else {
            // Otherwise, use the most recent feedback
            setFeedback(feedbacksData[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [id, user, loading, feedbackId]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Interview not found</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Feedback not found</h1>
          <Link href={`/interview/${id}`} className="text-primary-600 hover:text-primary-700">
            Return to interview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="section-feedback bg-white px-4 lg:px-8 py-3 lg:py-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold text-gray-900">
          Feedback:{" "}
          <span className="capitalize text-primary-600">{interview.role}</span> interview
        </h1>
      </div>

      <div className="flex flex-row justify-center mb-4">
        <p className="text-gray-600">{interview.techstack.join(', ')}</p>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5 max-sm:flex-col max-sm:items-center">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star-2.svg" width={22} height={22} alt="star" />
            <p className="text-gray-700">
              Overall Impression:{" "}
              <span className="text-primary-600 font-bold">
                {feedback.total_score}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p className="text-gray-700">
              {feedback.created_at
                ? dayjs(feedback.created_at).format("MMM D, YYYY HH:mm")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{feedback.final_assessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-gray-900">Breakdown of the Interview:</h2>
        {feedback.category_scores.map((category: { name: string; score: number; comment: string }, index: number) => (
          <div key={index} className="md:ml-4 bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-primary-600 font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p className="text-gray-700 mt-2">{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900">Strengths:</h3>
        <ul className="md:ml-6 space-y-2">
          {feedback.strengths.map((strength: string, index: number) => (
            <li key={index} className="text-gray-700 bg-gray-50 p-3 rounded-lg">{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900">Areas for Improvement:</h3>
        <ul className="md:ml-6 space-y-2">
          {feedback.areas_for_improvement.map((area: string, index: number) => (
            <li key={index} className="text-gray-700 bg-gray-50 p-3 rounded-lg">{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons mt-4">
        <Link href="/">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Back to Dashboard
          </button>
        </Link>
        <Link href={`/interview/${id}`}>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            Retake Interview
          </button>
        </Link>
      </div>
    </section>
  );
}