"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, BarChart, BookOpen, Clock, Star, ChevronRight } from "lucide-react";
import { getLatestPublicInterviews, getMyFeedbackForInterview } from "@/lib/actions/general.action";
import InterviewFormDialog from "@/components/interview/InterviewFormDialog";

interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  created_at: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);
  const accessToken = localStorage.getItem('access_token');


  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const interviews = await getLatestPublicInterviews(accessToken);
        if (interviews) {
          setRecentInterviews(interviews);
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setIsLoadingInterviews(false);
      }
    };

    if (user) {
      fetchInterviews();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <section className="relative py-16 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 text-white mb-12">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative max-w-3xl mx-auto text-center px-4">
              <h1 className="text-4xl font-bold mb-4">
                Welcome back, {user?.first_name || user?.username}! 👋
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Track your learning progress and continue your journey to mastery
              </p>
              <div className="flex items-center justify-center gap-4">
                <InterviewFormDialog />
                <Link
                  href="/my-interviews"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  View All Interviews
                  <BarChart className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* Recent Interviews Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Interviews
              </h2>
              <Link
                href="/my-interviews"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {isLoadingInterviews ? (
              <div className="text-center py-8">Loading interviews...</div>
            ) : recentInterviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentInterviews.map(interview => {
                  const feedbacks = interview.feedbacks;
                  const feedback = feedbacks?.[0]; // Get the first feedback if available
  
                  return (
                    <div key={interview.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{interview.role}</h3>
                          <p className="text-sm text-gray-600">{interview.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          feedback 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {feedback ? 'Completed' : 'Not Started'}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="h-4 w-4" />
                          <span>{interview.techstack.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(interview.created_at).toLocaleDateString()}</span>
                        </div>
                        {feedback && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>Score: {feedback.total_score}/100</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {feedback ? (
                          <Link
                            href={`/interview/${interview.id}/feedback`}
                            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                          >
                            View Feedback
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <Link
                            href={`/interview/${interview.id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                          >
                            Start Interview
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/interview/${interview.id}/attempts`}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          View Attempts
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No interviews available at the moment.
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
} 