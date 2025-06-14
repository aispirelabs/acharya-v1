// import { redirect } from "next/navigation"; // Not used if we remove server-side auth check
// import { getCurrentUser } from "@/lib/actions/auth.action"; // This action is deleted

// This page is a Server Component.
// The original version had a server-side auth check using a deleted action.
// Without a replacement server-side auth mechanism, we'll make it a simple welcome page.
// Authentication and redirection for unauthorized users should ideally be handled by
// client-side logic using AuthContext in a layout component (e.g., app/(root)/layout.tsx).

export default async function HomePage() {
  // const user = await getCurrentUser(); // Removed due to deleted action
  // if (!user) redirect("/sign-in"); // Removed server-side redirect

  // This page now assumes that if a user reaches it, they are authenticated,
  // or the content is generic enough not to require a specific user object here.
  // Client-side layout should handle redirects if not authenticated.
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to AcharyaAI</h1>
          <p className="text-gray-600">
            Your AI-powered interview preparation platform.
          </p>
          {/* Add links or calls to action here, e.g., to dashboard or create interview */}
        </div>
      </main>
    </div>
  );
}