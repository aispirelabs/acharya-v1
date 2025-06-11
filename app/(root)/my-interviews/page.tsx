import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Clock } from "lucide-react";
import Footer from "@/components/Footer";

export default async function MyInterviews({ 
  searchParams 
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const { page } = resolvedSearchParams;
  const currentPage = Number(page) || 1;
  const itemsPerPage = 9;

  const interviews = await getInterviewsByUserId(user?.id || '');
  const totalPages = Math.ceil((interviews?.length || 0) / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInterviews = interviews?.slice(startIndex, endIndex) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
          </div>

          {/* Interviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentInterviews.map((interview) => (
              <div key={interview.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{interview.role}</h3>
                    <p className="text-sm text-gray-600">{interview.type}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    interview.finalized 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {interview.finalized ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span>{interview.techstack}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {interview.finalized ? (
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
                      Continue Interview
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
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Link
                href={`/my-interviews?page=${Math.max(1, currentPage - 1)}`}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === 1
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/my-interviews?page=${page}`}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </Link>
              ))}
              <Link
                href={`/my-interviews?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === totalPages
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
} 