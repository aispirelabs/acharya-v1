"use client";

import React from "react";
import Image from "next/image";

interface CallViewProps {
  isSpeaking: boolean;
  userAvatar: string | null | undefined; // Allow null or undefined from user?.photoURL
  userName: string;
}

const CallView: React.FC<CallViewProps> = ({ isSpeaking, userAvatar, userName }) => {
  return (
    <div className="call-view">
      {/* AI Interviewer Card */}
      <div className="card-interviewer">
        <div className="avatar">
          <Image
            src="/ai-avatar-512.png"
            alt="AI Avatar"
            width={110}
            height={110}
            className="object-cover"
            priority // This image is likely visible early
          />
          {isSpeaking && <span className="animate-speak" />}
        </div>
        <h3>AI Interviewer</h3>
      </div>

      {/* User Profile Card */}
      <div className="card-border">
        <div className="card-content">
          <Image
            src={userAvatar || "/user-avatar.jpg"} // Fallback to default avatar
            alt="User Avatar"
            width={120} // Original was 539x539 for a 120px display, adjusted for clarity
            height={120}
            className="rounded-full object-cover size-[120px]"
            priority // This image is also likely visible early
          />
          <h3>{userName}</h3>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CallView);
