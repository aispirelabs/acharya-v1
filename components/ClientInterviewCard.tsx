"use client";
import { Interview } from "@/types/interview";

interface ClientInterviewCardProps {
  interview: Interview;
  userId?: string;
  interviewCard: React.ReactNode;
}

export default function ClientInterviewCard({
  interviewCard,
}: ClientInterviewCardProps) {
  return <>{interviewCard}</>;
}
