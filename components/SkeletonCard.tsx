"use client";

import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div> {/* Title */}
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div> {/* Subtitle */}
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-full"></div> {/* Badge */}
      </div>

      {/* Content Skeleton */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div> {/* Icon */}
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div> {/* Text line */}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div> {/* Icon */}
          <div className="h-4 w-4/6 bg-gray-200 rounded"></div> {/* Text line */}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div> {/* Icon */}
          <div className="h-4 w-3/6 bg-gray-200 rounded"></div> {/* Text line */}
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="h-5 w-28 bg-gray-200 rounded"></div> {/* Link */}
        <div className="h-5 w-24 bg-gray-200 rounded"></div> {/* Link */}
      </div>
    </div>
  );
};

export default SkeletonCard;
