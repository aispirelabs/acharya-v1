export interface Interview {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  finalized: boolean;
  createdAt: string;
  coverImage: string;
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

export interface Feedback {
  id: string;
  interviewId: string;
  userId: string;
  score: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  coverImage?: string;
  level?: string;
  questions?: string[];
  finalized: boolean;
  attempts?: Array<{
    id: string;
    score?: number;
    feedback?: string;
    createdAt: string;
    answers?: Array<{
      question: string;
      answer: string;
    }>;
  }>;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

// Add photoURL to your existing User interface
interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  emailVerified?: boolean;
}

interface InterviewCardProps {
  interviewId: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  coverImage?: string;
  level?: string;
  questions?: string[];
}

// Add userAvatar to the AgentProps interface
interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
  userAvatar?: string;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}
