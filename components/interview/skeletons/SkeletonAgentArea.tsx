"use client";

import React from "react";

const SkeletonAgentArea: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      {/* Placeholder for Agent's CallView */}
      <div className="flex sm:flex-row flex-col gap-10 items-center justify-between w-full mb-6">
        {/* AI Interviewer Card Skeleton */}
        <div className="flex-center flex-col gap-2 p-7 h-[300px] md:h-[350px] bg-gray-100 rounded-lg border-2 border-gray-200/50 flex-1 sm:basis-1/2 w-full">
          <div className="w-28 h-28 bg-gray-200 rounded-full mb-3"></div> {/* AI Avatar */}
          <div className="h-6 w-3/5 bg-gray-200 rounded"></div> {/* AI Name */}
        </div>
        {/* User Profile Card Skeleton */}
        <div className="border-gray-200 p-0.5 rounded-2xl flex-1 sm:basis-1/2 w-full h-[300px] md:h-[350px] max-md:hidden">
          <div className="flex flex-col gap-2 justify-center items-center p-7 bg-gray-100 rounded-2xl min-h-full">
            <div className="w-28 h-28 bg-gray-200 rounded-full mb-3"></div> {/* User Avatar */}
            <div className="h-6 w-3/5 bg-gray-200 rounded"></div> {/* User Name */}
          </div>
        </div>
      </div>

      {/* Placeholder for Transcript Display */}
      <div className="border-gray-200 p-0.5 rounded-2xl w-full mb-6">
        <div className="bg-gray-100 rounded-2xl min-h-12 px-5 py-3 flex items-center justify-center">
          <div className="h-5 w-4/5 bg-gray-200 rounded"></div> {/* Transcript line */}
        </div>
      </div>

      {/* Placeholder for Call Controls */}
      <div className="w-full flex justify-center relative">
        <div className="h-12 w-32 bg-gray-200 rounded-full"></div> {/* Button placeholder */}
      </div>
    </div>
  );
};

export default SkeletonAgentArea;
