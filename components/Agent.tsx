"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef } from "react"; // Added useRef
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import genAI from "@/lib/gemini.sdk"; // Import Gemini SDK
import { Modality } from "@google/genai"; // Import Modality for config
// import { interviewer } from "@/constants"; // No longer needed, using system prompt
import { request, getAccessToken } from "@/lib/apiClient";
import { AgentProps } from "@/types";

const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-native-audio-dialog";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  ERROR = "ERROR",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
  audio?: Uint8Array; // Not currently used for storing, but good for type consistency
}

const Agent = React.memo(({
  userName,
  userId,
  interviewId,
  type,
  questions,
  userAvatar,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false); // AI speaking
  const [lastMessage, setLastMessage] = useState<string>("");

  const geminiSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioProcessorNodeRef = useRef<ScriptProcessorNode | null>(null); // Typed
  const audioQueueRef = useRef<ArrayBuffer[]>([]); // Store ArrayBuffers directly
  const isPlayingAudioRef = useRef(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const totalQuestions = questions?.length || 0;

  const playNextAudioChunk = useCallback(() => {
    if (isPlayingAudioRef.current || audioQueueRef.current.length === 0 || !audioContextRef.current || audioContextRef.current.state === 'closed') {
      if (audioQueueRef.current.length === 0 && !isPlayingAudioRef.current) {
        setIsSpeaking(false);
      }
      return;
    }

    isPlayingAudioRef.current = true;
    setIsSpeaking(true);
    const audioDataBuffer = audioQueueRef.current.shift();

    if (audioDataBuffer) {
      audioContextRef.current.decodeAudioData(audioDataBuffer)
        .then(audioBuffer => {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.onended = () => {
            isPlayingAudioRef.current = false;
            playNextAudioChunk();
          };
          source.start();
        })
        .catch(e => {
          console.error("Error decoding audio data:", e);
          isPlayingAudioRef.current = false;
          playNextAudioChunk();
        });
    } else {
      isPlayingAudioRef.current = false;
      setIsSpeaking(false);
    }
  }, []);

  // Helper function to convert Float32Array to Int16Array (PCM)
  const float32ToInt16 = (buffer: Float32Array): Int16Array => {
    let l = buffer.length;
    const output = new Int16Array(l);
    while (l--) {
      output[l] = Math.min(1, Math.max(-1, buffer[l])) * 0x7FFF; // Clamp and convert
    }
    return output;
  };

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const startAudioProcessing = useCallback(() => {
    if (!mediaStreamRef.current || !audioContextRef.current || audioContextRef.current.state === 'closed' || !geminiSessionRef.current || audioProcessorNodeRef.current) {
      console.warn("Audio processing prerequisites not met or already started/closed.");
      if (geminiSessionRef.current && callStatus === CallStatus.ACTIVE) {
         // If session is active but other audio components failed, this is an issue.
         // toast.error("Audio components not ready. Please try reconnecting.");
         // Consider calling handleDisconnect or setting an error state.
      }
      return;
    }

    const audioContext = audioContextRef.current;
    const source = audioContext.createMediaStreamSource(mediaStreamRef.current);
    // Buffer size, 1 input channel, 1 output channel. 4096 is a common buffer size.
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e: AudioProcessingEvent) => {
      if (callStatus !== CallStatus.ACTIVE || !geminiSessionRef.current || !geminiSessionRef.current.sendRealtimeInput) {
        return;
      }

      const inputData = e.inputBuffer.getChannelData(0);
      let downsampledData = inputData;
      const sourceSampleRate = audioContext.sampleRate;
      const targetSampleRate = 16000;

      if (sourceSampleRate > targetSampleRate) {
        const sampleRateRatio = sourceSampleRate / targetSampleRate;
        const newLength = Math.round(inputData.length / sampleRateRatio);
        downsampledData = new Float32Array(newLength);
        let offsetResult = 0;
        let offsetBuffer = 0;
        while (offsetResult < newLength) {
          const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
          let accum = 0, count = 0;
          for (let i = offsetBuffer; i < nextOffsetBuffer && i < inputData.length; i++) {
            accum += inputData[i];
            count++;
          }
          downsampledData[offsetResult] = count > 0 ? accum / count : 0;
          offsetResult++;
          offsetBuffer = nextOffsetBuffer;
        }
      } else if (sourceSampleRate < targetSampleRate) {
        console.warn(`Source SR ${sourceSampleRate} < target SR ${targetSampleRate}. Sending as is.`);
      }

      const pcmData = float32ToInt16(downsampledData);
      const base64Audio = arrayBufferToBase64(pcmData.buffer);

      try {
        geminiSessionRef.current.sendRealtimeInput({ audio: { data: base64Audio, mimeType: "audio/pcm;rate=16000" } });
      } catch (error) {
        console.error("Error sending audio data to Gemini:", error);
        // Consider how to handle this - maybe stop processing, show error, etc.
        // For now, just logging. If this error persists, might need to stop the call.
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    audioProcessorNodeRef.current = processor;
    console.log("Audio processing started.");

  }, [callStatus]); // Depends on callStatus to stop processing when not ACTIVE


  const handleDisconnect = useCallback(async (isError?: boolean) => {
    console.log("Disconnecting call...", isError ? "due to error" : "user action");

    if (audioProcessorNodeRef.current) {
      audioProcessorNodeRef.current.disconnect();
      audioProcessorNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (geminiSessionRef.current && geminiSessionRef.current.close) {
      try {
        geminiSessionRef.current.close();
      } catch (e) { console.error("Error closing gemini session:", e); }
      geminiSessionRef.current = null;
    }
     if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        await audioContextRef.current.close();
      } catch (e) { console.error("Error closing audio context:", e); }
      audioContextRef.current = null;
    }

    setCallStatus(isError ? CallStatus.ERROR : CallStatus.FINISHED);
    setIsSpeaking(false);
    audioQueueRef.current = [];
    isPlayingAudioRef.current = false;

    if (!isError && callStatus !== CallStatus.FINISHED) { // Avoid double toast if finished by error or already finished
        toast.info("Call ended.", { id: "call-status-toast" });
    } else if (isError && callStatus !== CallStatus.ERROR) {
        // Error toast would be shown by the caller of handleDisconnect(true)
    }
  }, [callStatus]); // Include callStatus

  const handleGenerateFeedbackInternal = useCallback(async (currentMessages: SavedMessage[]) => {
    const textMessages = currentMessages.filter(msg => msg.content && !msg.audio) // Ensure content exists
                                       .map(msg => ({ role: msg.role, content: msg.content }));
    if (textMessages.length === 0) {
      toast.info("No text conversation to generate feedback from.", { id: "feedback-toast" });
      return;
    }
    toast.loading("Generating feedback from your interview...", { id: "feedback-toast" });
    const accessToken = getAccessToken();
    if (!accessToken) {
      toast.error("Authentication error.", { id: "feedback-toast" });
      router.push("/sign-in");
      return;
    }
    try {
      const feedbackData = await request("POST", "/acharya_ai/feedback/create/", {
        interview_id: interviewId!,
        transcript: textMessages,
      });
      if (feedbackData && feedbackData.id) {
        toast.success("Feedback generated successfully!", { id: "feedback-toast" });
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        toast.error("Failed to generate feedback: Invalid server response.", { id: "feedback-toast" });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate feedback.", { id: "feedback-toast" });
    }
  }, [interviewId, router]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "assistant" && lastMsg.content) {
        setLastMessage(lastMsg.content);
      }
    }
    if ((callStatus === CallStatus.FINISHED || callStatus === CallStatus.ERROR) && type !== "generate" && messages.length > 0) {
      // Check if feedback hasn't been generated for this session
      // This simple check might need refinement to prevent multiple feedback generations for the same interview
      const hasUserOrAssistantMessages = messages.some(m => m.role === 'user' || m.role === 'assistant');
      if (hasUserOrAssistantMessages) { // Only generate feedback if there was some interaction
          handleGenerateFeedbackInternal(messages);
      }
    } else if ((callStatus === CallStatus.FINISHED || callStatus === CallStatus.ERROR) && type === "generate") {
      toast.success("Interview generation process finished.", { id: "generate-toast" });
    }
  }, [messages, callStatus, type, handleGenerateFeedbackInternal]);


  const handleCall = useCallback(async () => {
    setCallStatus(CallStatus.CONNECTING);
    audioQueueRef.current = [];
    isPlayingAudioRef.current = false;
    setMessages([]); // Clear previous messages

    toast.loading("Connecting to AI Interviewer...", { id: "call-status-toast", duration: 15000 });

    try {
      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      let systemPrompt = `You are an AI Interviewer. Your name is PyTAI (Python Technical Assessment Interviewer). Your goal is to conduct an effective interview with the user, ${userName}. `;
      if (type === "generate") {
        systemPrompt += `Your task is to collaboratively generate a set of technical interview questions with ${userName}. Engage in a short conversation to understand their desired role or topics, then list 3-5 questions. After listing, ask if they are happy with the questions or want adjustments.`;
      } else if (questions && questions.length > 0) {
        const formattedQuestions = questions.map((q, i) => `${i+1}. ${q}`).join("\n");
        systemPrompt += `Please conduct an interview with ${userName}. Ask the following questions, but feel free to ask follow-up questions and make the conversation natural and engaging:\n${formattedQuestions}\nKeep your responses concise and focused on the interview.`;
      } else {
        systemPrompt += `Please conduct a general behavioral or technical interview with ${userName}. Start by introducing yourself and the purpose of the interview. Then ask a mix of common behavioral and technical questions suitable for a software engineering role.`;
      }
      systemPrompt += "\nConclude the interview by saying 'Thank you for your time. The interview is now complete.' Do not say this phrase until the very end of the entire conversation.";

      geminiSessionRef.current = await genAI.live.connect({
        model: GEMINI_MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO, Modality.TEXT],
          systemInstruction: systemPrompt,
        },
        callbacks: {
          onopen: () => {
            setCallStatus(CallStatus.ACTIVE);
            toast.success("Connected! Interview starting...", { id: "call-status-toast", duration: 3000 });
            startAudioProcessing();
          },
          onmessage: (message: any) => {
            let aiTextMessage = "";
            let userTextMessage = "";

            if (message.data && message.data.byteLength > 0) {
              audioQueueRef.current.push(message.data.slice(0)); // Copy ArrayBuffer
              playNextAudioChunk();
            }

            if (message.serverContent) {
                if (message.serverContent.modelTurn?.parts) {
                    const textPart = message.serverContent.modelTurn.parts.find((part: any) => part.text);
                    if (textPart && textPart.text.trim()) aiTextMessage = textPart.text.trim();
                }
                if (message.serverContent.clientTurn?.parts) { // User's turn transcript
                    const userTextPart = message.serverContent.clientTurn.parts.find((part: any) => part.text);
                    if (userTextPart && userTextPart.text.trim()) userTextMessage = userTextPart.text.trim();
                }
            }

            if (userTextMessage) {
                 setMessages((prev) => [...prev, { role: "user", content: userTextMessage }]);
            }
            if (aiTextMessage) {
                setMessages((prev) => [...prev, { role: "assistant", content: aiTextMessage }]);
                if (totalQuestions > 0 && currentQuestionIndex < totalQuestions && questions && aiTextMessage.toLowerCase().includes(questions[currentQuestionIndex].toLowerCase().substring(0, 20))) { // Basic matching
                    setCurrentQuestionIndex(prev => prev + 1);
                }
                 // Check for end phrase from AI
                if (aiTextMessage.toLowerCase().includes("interview is now complete")) {
                    console.log("AI indicated interview completion.");
                    handleDisconnect(false); // Not an error
                }
            }
          },
          onerror: (error: Error) => {
            console.error("Gemini SDK Error:", error);
            toast.error(`Connection error: ${error.message}`, { id: "call-status-toast" });
            handleDisconnect(true); // Pass true for error
          },
          onclose: (reason?: CloseEvent) => {
            console.log("Gemini session closed.", reason);
            if (callStatus !== CallStatus.ERROR && callStatus !== CallStatus.FINISHED) {
                toast.info(reason?.reason || "Call ended by server.", { id: "call-status-toast" });
                handleDisconnect(false); // Not an error
            }
          },
        },
      });

    } catch (error: any) {
      console.error("Failed to start Gemini call:", error);
      toast.error(`Failed to start call: ${error.message || "Unknown error"}`, { id: "call-status-toast" });
      handleDisconnect(true); // Pass true for error
    }
  }, [type, questions, userName, userId, callStatus, currentQuestionIndex, totalQuestions, startAudioProcessing, handleDisconnect, handleGenerateFeedbackInternal]);

  return (
    <>
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
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src={userAvatar || "/user-avatar.jpg"}
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100",
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center relative">
        {/* CallHint and showCallHint logic removed */}

        {callStatus !== CallStatus.ACTIVE ? (
          <button
            id="call-button"
            className="relative btn-call"
            onClick={() => handleCall()}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden",
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
                "Call"
              ) : (
                <span className="dots-loading">. . .</span>
              )}
            </span>
          </button>
        ) : (
          <button
            className="btn-disconnect cursor-pointer"
            onClick={() => handleDisconnect()}
          >
            End
          </button>
        )}
      </div>
    </>
  );
});

export default React.memo(Agent); // Memoize Agent component
