import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { InterviewCardProps } from "@/types";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  coverImage,
  level,
  questions,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  // Type badge color mapping
  const typeBadgeColor =
    {
      Behavioral: "bg-primary-100 text-primary-600",
      Mixed: "bg-accent-100 text-accent-600",
      Technical: "bg-blue-100 text-blue-600",
    }[normalizedType] || "bg-violet-100 text-violet-600";

  // Level badge color mapping
  const levelBadgeColor =
    {
      "entry level": "bg-emerald-100 text-emerald-600",
      beginner: "bg-teal-100 text-teal-600",
      junior: "bg-lime-100 text-lime-600",
      "mid to senior": "bg-amber-100 text-amber-600",
      senior: "bg-orange-100 text-orange-600",
      advanced: "bg-sky-100 text-sky-600",
      expert: "bg-indigo-100 text-indigo-600",
    }[level?.toLowerCase() || "beginner"] || "bg-green-100 text-green-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now(),
  ).format("MMM D, YYYY");

  // Use coverImage from props if available, otherwise use random cover
  const imageSrc = coverImage || getRandomInterviewCover();

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <div className="relative card hover:scale-[1.02] transition-transform duration-300">
        <div className="relative">
          {/* Type Badge - Top Right */}
          <div
            className={cn(
              "absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium",
              typeBadgeColor,
            )}
          >
            {normalizedType}
          </div>

          {/* Level Badge - Top Left */}
          <div
            className={cn(
              "absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium",
              levelBadgeColor,
            )}
          >
            {level || "Beginner"}
          </div>

          {/* Cover Image */}
          <div className="flex justify-center pt-12 pb-6">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur" />
              <Image
                src={imageSrc}
                alt="Course cover"
                width={120}
                height={120}
                className="relative rounded-2xl object-cover size-[120px]"
              />
            </div>
          </div>

          {/* Course Title */}
          <h3 className="text-xl font-semibold text-center mb-4 capitalize">
            {role} Course
          </h3>

          {/* Course Details */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Image
                src="/calendar.svg"
                width={20}
                height={20}
                alt="calendar"
                className="opacity-70"
              />
              <span className="text-sm">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Image
                src="/star-2.svg"
                width={20}
                height={20}
                alt="score"
                className="opacity-70"
              />
              <span className="text-sm">
                {feedback?.totalScore || "---"}/100
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Image
                src="/question.svg"
                width={20}
                height={20}
                alt="lessons"
                className="opacity-70"
              />
              <span className="text-sm">{questions?.length || 0} Lessons</span>
            </div>
          </div>

          {/* Course Description */}
          <p className="text-muted-foreground text-sm text-center mb-6 px-4 line-clamp-2">
            {feedback?.finalAssessment ||
              "Start your learning journey with this comprehensive course. Master new skills through interactive lessons and practical exercises."}
          </p>

          {/* Tech Stack and Action Button */}
          <div className="flex flex-col gap-4 p-4 border-t">
            <DisplayTechIcons techStack={techstack} />

            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
              className="w-full"
            >
              <button
                className={cn(
                  "w-full py-3 px-4 rounded-full text-sm font-medium transition-all duration-300",
                  feedback
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                    : "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20",
                )}
              >
                {feedback ? "View Progress" : "Start Learning"}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
