"use client";

import React from "react";

const SkeletonSidebarCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-6 w-3/5 bg-gray-200 rounded mb-6"></div>

      {/* Line items skeleton */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full mt-1"></div> {/* Icon placeholder */}
          <div className="h-5 w-5/6 bg-gray-200 rounded"></div> {/* Text line */}
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full mt-1"></div>
          <div className="h-5 w-4/6 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full mt-1"></div>
          <div className="h-5 w-5/6 bg-gray-200 rounded"></div>
        </div>
        {/* Optional fourth line for longer sidebars */}
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full mt-1"></div>
          <div className="h-5 w-3/6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonSidebarCard;
