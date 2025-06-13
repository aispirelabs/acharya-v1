import { Feedback } from "./index";

export interface Interview {
  id: string; // Assuming UUID string
  user: string; // User ID (foreign key)
  role: string;
  type: string;
  techstack: string[]; // JSONField in Django, maps to array
  finalized: boolean;
  created_at: string; // ISO String
  cover_image?: string;
  level: string;
  questions: string[]; // JSONField in Django, maps to array
  feedbacks?: Feedback[]; // Array of feedbacks for this interview
  attempts?: InterviewAttempt[]; // Array of attempts for this interview
}

// This interface is not directly handled by current Django models.
// Leaving as is for potential client-side use or future expansion.
export interface InterviewAttempt {
  id: string;
  interviewId: string;
  score?: number;
  total_score?: number;
  feedback?: string;
  created_at: string;
  answers?: {
    question: string;
    answer: string;
  }[];
}
