export interface Interview {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  finalized: boolean;
  createdAt: string;
  coverImage?: string;
  level: string;
  questions: string[];
  attempts?: InterviewAttempt[];
}

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
