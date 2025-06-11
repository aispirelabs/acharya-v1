import { Interview } from "@/types/interview";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";

export async function getInterviews(): Promise<Interview[]> {
  const user = await getCurrentUser();
  const [userInterviews, allInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id || ''),
    getLatestInterviews({ userId: user?.id || '' }),
  ]);

  // Combine and sort interviews by creation date
  const allInterviewsList = [...(userInterviews || []), ...(allInterviews || [])];
  return allInterviewsList.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
} 