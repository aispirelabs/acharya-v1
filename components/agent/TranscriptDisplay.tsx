"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TranscriptDisplayProps {
  lastMessage: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ lastMessage }) => {
  if (!lastMessage) {
    return null; // Don't render if there's no message
  }

  return (
    <div className="transcript-border">
      <div className="transcript">
        <p
          // Using lastMessage as key might re-trigger animation on every new message.
          // If a more stable key is needed and messages have IDs, that would be better.
          // For now, this ensures the animation plays for new content.
          key={lastMessage}
          className={cn(
            "transition-opacity duration-500 opacity-0",
            "animate-fadeIn opacity-100", // Ensure animate-fadeIn is defined in CSS
          )}
        >
          {lastMessage}
        </p>
      </div>
    </div>
  );
};

export default React.memo(TranscriptDisplay);
