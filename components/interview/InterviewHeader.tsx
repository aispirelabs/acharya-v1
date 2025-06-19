"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface InterviewHeaderProps {
  role: string;
  imageSrc: string;
  questionCount: number;
  displayLevel: string;
  levelBadgeColor: string;
  displayType: string;
  typeBadgeColor: string;
  techstack: string[];
}

const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  role,
  imageSrc,
  questionCount,
  displayLevel,
  levelBadgeColor,
  displayType,
  typeBadgeColor,
  techstack,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={imageSrc}
              alt="cover-image" // Consider making alt more dynamic if imageSrc changes meaning
              width={80}
              height={80}
              className="rounded-xl object-cover size-[80px]"
              priority // If this is LCP, consider adding priority
            />
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
              <div className="bg-primary-600 rounded-full p-1">
                <Image
                  src="/globe.svg" // Assuming this is a static asset for "microphone"
                  width={20}
                  height={20}
                  alt="microphone icon"
                  className="text-white" // This className might not affect SVG color directly, depends on SVG content
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 capitalize">
              {role} Interview
            </h3>
            <p className="text-gray-600 mt-1">
              Get ready for your interview session
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-10 px-4 py-2 rounded-full">
            <Image
              src="/question.svg" // Assuming static asset
              width={20}
              height={20}
              alt="questions icon"
            />
            <span className="text-gray-700 bg-sky-550 font-medium">
              {questionCount} questions
            </span>
          </div>

          <div className="flex gap-2">
            <span
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium",
                levelBadgeColor
              )}
            >
              {displayLevel}
            </span>
            <span
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium",
                typeBadgeColor
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
          {techstack.map((tech, index) => (
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
  );
};

export default React.memo(InterviewHeader);
