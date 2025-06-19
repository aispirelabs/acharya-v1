"use client";

import React from "react";

const SkeletonInterviewHeader: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        {/* Left side: Avatar and Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div> {/* Avatar placeholder */}
            <div className="absolute -bottom-2 -right-2 bg-gray-100 rounded-full p-1 shadow-md">
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div> {/* Icon placeholder */}
            </div>
          </div>
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div> {/* Title */}
            <div className="h-5 w-64 bg-gray-200 rounded"></div> {/* Subtitle */}
          </div>
        </div>

        {/* Right side: Badges and Question Count */}
        <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
          <div className="h-10 w-28 bg-gray-200 rounded-full"></div> {/* Question count badge */}
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded-full"></div> {/* Level badge */}
            <div className="h-10 w-24 bg-gray-200 rounded-full"></div> {/* Type badge */}
          </div>
        </div>
      </div>

      {/* Tech Stack Skeleton */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div> {/* Tech Stack Title */}
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-7 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-7 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonInterviewHeader;
