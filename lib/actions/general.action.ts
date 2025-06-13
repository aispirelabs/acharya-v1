"use server"; // These actions run on the server side in Next.js

// Firebase and AI SDK imports are removed as this logic is now in Django backend
// import { generateObject } from "ai";
// import { google } from "@ai-sdk/google";
// import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";
// import { db } from "@/firebase/admin";
// import { feedbackSchema } from "@/constants";

import { Interview, Feedback } from "@/types"; // Assuming these types will be updated/compatible

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Interface for creating an interview (payload for Django API)
// This was previously handled by app/api/interviews/create/route.ts
// Now, this action will call the Django endpoint directly.
export interface CreateInterviewParams {
  role: string;
  type: string;
  level: string;
  techstack: string[];
  max_questions: number; // This was maxQuestions in old route.ts, Django uses max_questions
}

export async function createInterview(
  params: CreateInterviewParams,
  accessToken: string | null
): Promise<{ success: boolean; interview?: Interview; interviewId?: string; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "Authentication token not provided." };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/acharya_ai/interviews/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating interview:", errorData);
      return { success: false, error: errorData.detail || "Failed to create interview." };
    }
    const interviewData: Interview = await response.json();
    return { success: true, interview: interviewData, interviewId: interviewData.id };
  } catch (error) {
    console.error("Network or unexpected error creating interview:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}


// Interface for creating feedback (payload for Django API)
// The old CreateFeedbackParams included userId, which is now derived from the auth token on backend.
export interface DjangoCreateFeedbackParams {
  interview_id: string; // Changed from interviewId to match Django serializer
  transcript: Array<{ role: string; content: string }>;
}

export async function createFeedback(
  params: DjangoCreateFeedbackParams,
  accessToken: string | null
): Promise<{ success: boolean; feedback?: Feedback; feedbackId?: string; error?: string }> {
  if (!accessToken) {
    return { success: false, error: "Authentication token not provided." };
  }
  try {
    // The AI generation logic is now in the Django backend.
    // This function just sends the necessary data.
    const response = await fetch(`${API_BASE_URL}/acharya_ai/feedback/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating feedback:", errorData);
      return { success: false, error: errorData.detail || "Failed to create feedback." };
    }
    const feedbackData: Feedback = await response.json();
    return { success: true, feedback: feedbackData, feedbackId: feedbackData.id };
  } catch (error) {
    console.error("Network or unexpected error creating feedback:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getInterviewById(
  id: string,
  accessToken: string | null
): Promise<Interview | null> {
  if (!accessToken) {
    console.error("getInterviewById: Authentication token not provided.");
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/acharya_ai/interviews/${id}/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      console.error("Error fetching interview by ID:", response.status, await response.text());
      return null;
    }
    return await response.json() as Interview;
  } catch (error) {
    console.error("Network or unexpected error fetching interview by ID:", error);
    return null;
  }
}

// Fetches interviews by the authenticated user
export async function getMyInterviews(
  accessToken: string | null
): Promise<Interview[] | null> {
  if (!accessToken) {
    console.error("getMyInterviews: Authentication token not provided.");
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/acharya_ai/interviews/?my_interviews=true`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      console.error("Error fetching user's interviews:", response.status, await response.text());
      return null;
    }
    return await response.json() as Interview[];
  } catch (error) {
    console.error("Network or unexpected error fetching user's interviews:", error);
    return null;
  }
}

// Fetches latest interviews from other users
// The old GetLatestInterviewsParams had userId and limit.
// Django backend's InterviewListView handles excluding current user's interviews and pagination (if implemented).
// For now, we assume the default list from /api/acharya_ai/interviews/ is what's needed.
// Limit can be added as a query param if Django endpoint supports it.
export async function getLatestPublicInterviews(
  accessToken: string | null,
  limit?: number
): Promise<Interview[] | null> {
  if (!accessToken) {
    console.error("getLatestPublicInterviews: Authentication token not provided.");
    return null;
  }
  try {
    let url = `${API_BASE_URL}/acharya_ai/interviews/`;
    if (limit) {
      url += `?limit=${limit}`; // Assuming Django endpoint supports a 'limit' query param
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      console.error("Error fetching latest public interviews:", response.status, await response.text());
      return null;
    }
    return await response.json() as Interview[];
  } catch (error) {
    console.error("Network or unexpected error fetching latest public interviews:", error);
    return null;
  }
}


// Fetches feedback for a specific interview, submitted by the authenticated user.
// The old GetFeedbackByInterviewIdParams also took userId, which is now implicit from the token.
export async function getMyFeedbackForInterview(
  interviewId: string,
  accessToken: string | null
): Promise<Feedback[] | null> { // Django endpoint returns a list of feedback by this user for this interview
  if (!accessToken) {
    console.error("getMyFeedbackForInterview: Authentication token not provided.");
    return null;
  }
  try {
    // Django endpoint is /api/acharya_ai/interviews/<interview_id>/feedback/
    const response = await fetch(`${API_BASE_URL}/acharya_ai/interviews/${interviewId}/feedback/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      console.error("Error fetching feedback for interview:", response.status, await response.text());
      return null;
    }
    // The Django view for this was designed to return a list of feedback items
    // If you expect only one, you might take the first element or adjust the Django view.
    return await response.json() as Feedback[];
  } catch (error) {
    console.error("Network or unexpected error fetching feedback:", error);
    return null;
  }
}

// The old getFeedbacksByInterviewId was more generic.
// The current Django setup for /interviews/<interview_id>/feedback/ is user-specific.
// If a more general, non-user-specific feedback list for an interview is needed,
// a new Django endpoint would be required. For now, this function is similar to above.
export async function getFeedbacksForInterviewGeneral(
  interviewId: string,
  accessToken: string | null, // Still needed if the endpoint is protected, even if not filtering by user
  // params: { limit?: number; offset?: number; countOnly?: boolean; } // Pagination params if Django supports
): Promise<Feedback[] | null> { // Or number if countOnly was implemented
  if (!accessToken) {
    console.error("getFeedbacksForInterviewGeneral: Authentication token not provided.");
    return null;
  }
  // This reuses the same endpoint as getMyFeedbackForInterview.
  // If public feedback is intended, the Django endpoint needs to change its permissioning.
  console.warn("getFeedbacksForInterviewGeneral currently calls the user-specific feedback endpoint.");
  return getMyFeedbackForInterview(interviewId, accessToken);
}
