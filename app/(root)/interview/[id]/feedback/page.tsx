import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
  getFeedbacksByInterviewId,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
// import { MetalButton } from "@/components/MetalButton";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    feedbackId?: string;
  };
}

const Feedback = async ({ params, searchParams }: PageProps) => {
  const { id } = await params;
  const { feedbackId } = await searchParams;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  let feedback;
  if (feedbackId) {
    // Get specific feedback
    const feedbacks = await getFeedbacksByInterviewId(id) as [];
    feedback = feedbacks.find(f => f.id === feedbackId);
  } else {
    // Get latest feedback
    feedback = await getFeedbackByInterviewId({
      interviewId: id,
      userId: user?.id ?? '',
    });
  }

  if (!feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Feedback not found</h1>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Return to dashboard
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

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5 max-sm:flex-col max-sm:items-center">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star-2.svg" width={22} height={22} alt="star" />
            <p className="text-gray-700">
              Overall Impression:{" "}
              <span className="text-primary-600 font-bold">
                {feedback.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p className="text-gray-700">
              {feedback.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY HH:mm")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{feedback.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-gray-900">Breakdown of the Interview:</h2>
        {feedback.categoryScores.map((category: { name: string; score: number; comment: string }, index: number) => (
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
          {feedback.areasForImprovement.map((area: string, index: number) => (
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
};

export default Feedback;