// import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Star, ChevronRight, BarChart } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews, getFeedbackByInterviewId } from "@/lib/actions/general.action";
// import InterviewCard from "@/components/InterviewCard";
// import AllInterviewsList from "@/components/AllInterviewsList";
// import ClientInterviewCard from "@/components/ClientInterviewCard";
import Footer from "@/components/Footer";

export default async function Dashboard() {
  const user = await getCurrentUser();
  const [userInterviews, allInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id || ''),
    getLatestInterviews({ userId: user?.id || '' }),
  ]);

  

  // Filter interviews based on finalized status
  const pastInterviews = userInterviews?.filter(
    (interview) => interview.finalized
  ) || [];
  const upcomingInterviews = allInterviews?.filter(
    (interview) => !interview.finalized
  ) || [];

  // Get only the 5 most recent interviews
  const recentInterviews = [...pastInterviews, ...upcomingInterviews]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Pre-render all interview cards on the server
  // const renderedInterviewCards = await Promise.all(
  //   (allInterviews || []).map(async (interview) => {
  //     const interviewCard = await (
  //       <InterviewCard
  //         key={interview.id}
  //         userId={user?.id}
  //         interviewId={interview.id}
  //         role={interview.role}
  //         type={interview.type}
  //         techstack={interview.techstack}
  //         createdAt={interview.createdAt}
  //         coverImage={interview.coverImage}
  //         level={interview.level}
  //         questions={interview.questions}
  //       />
  //     );
      
  //     return (
  //       <ClientInterviewCard
  //         key={interview.id}
  //         interview={interview}
  //         userId={user?.id}
  //         interviewCard={interviewCard}
  //       />
  //     );
  //   })
  // );

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
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Track your learning progress and continue your journey to mastery
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/interview"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  Start New Interview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentInterviews.map(async (interview) => {
                const feedback = await getFeedbackByInterviewId({
                  interviewId: interview.id,
                  userId: user?.id || '',
                });

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
                        <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                      </div>
                      {feedback && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>Score: {feedback.totalScore}/100</span>
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
          </section>

          {/* Stats Section */}
          {/* <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{pastInterviews.length + upcomingInterviews.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{pastInterviews.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingInterviews.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Achievement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pastInterviews.length > 0 
                      ? Math.round((pastInterviews.length / (pastInterviews.length + upcomingInterviews.length)) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </section> */}

          {/* Learning Progress */}
          {/* {pastInterviews.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Learning Progress
                </h2>
                <Link
                  href="/progress"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastInterviews.map((interview) => (
                  <ClientInterviewCard
                    key={interview.id}
                    interview={interview}
                    userId={user?.id}
                    interviewCard={
                      <InterviewCard
                        key={interview.id}
                        userId={user?.id}
                        interviewId={interview.id}
                        role={interview.role}
                        type={interview.type}
                        techstack={interview.techstack}
                        createdAt={interview.createdAt}
                        coverImage={interview.coverImage}
                        level={interview.level}
                        questions={interview.questions}
                      />
                    }
                  />
                ))}
              </div>
            </section>
          )} */}

          {/* Available Courses */}
          {/* {upcomingInterviews.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Recommended for You
                </h2>
                <Link
                  href="/courses"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={user?.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                    coverImage={interview.coverImage}
                    level={interview.level}
                    questions={interview.questions}
                  />
                ))}
              </div>
            </section>
          )} */}

          {/* All Courses */}
          {/* <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Explore All Courses
              </h2>
              <Link
                href="/courses"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <AllInterviewsList renderedCards={renderedInterviewCards} />
            </div>
          </section> */}
        </div>
      </main>

      <Footer />
    </div>
  );
} 