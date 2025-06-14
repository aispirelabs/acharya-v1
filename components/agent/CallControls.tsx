"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Assuming CallStatus enum is defined elsewhere and imported, or define it here if specific to controls
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface CallControlsProps {
  callStatus: CallStatus;
  handleCall: () => void;
  handleDisconnect: () => void;
  // type prop might be needed if button text depends on it, like "generate interview" vs "start interview"
  // For now, keeping it simple as per Agent.tsx's direct button text.
}

const CallControls: React.FC<CallControlsProps> = ({
  callStatus,
  handleCall,
  handleDisconnect,
}) => {
  return (
    <div className="w-full flex justify-center relative">
      {callStatus !== CallStatus.ACTIVE ? (
        <button
          id="call-button" // Keep ID if CallHint (if ever restored) or other logic relies on it
          className="relative btn-call"
          onClick={handleCall}
          disabled={callStatus === CallStatus.CONNECTING} // Disable when connecting
        >
          <span
            className={cn(
              "absolute animate-ping rounded-full opacity-75",
              callStatus !== CallStatus.CONNECTING && "hidden",
            )}
          />
          <span className="relative">
            {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? (
              "Call" // Or dynamically change based on 'type' prop if added
            ) : (
              <span className="dots-loading">. . .</span> // Loading state
            )}
          </span>
        </button>
      ) : (
        <button
          className="btn-disconnect cursor-pointer"
          onClick={handleDisconnect}
        >
          End
        </button>
      )}
    </div>
  );
};

export default React.memo(CallControls);
