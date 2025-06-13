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
  attempts?: InterviewAttempt[]; // Remains as is, client-side or future feature
}

// This interface is not directly handled by current Django models.
// Leaving as is for potential client-side use or future expansion.
export interface InterviewAttempt {
  id: string;
  interviewId: string;
  score?: number;
  feedback?: string;
  createdAt: string;
  answers?: {
    question: string;
    answer: string;
  }[];
}
