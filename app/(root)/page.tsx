import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to AcharyaAI</h1>
          <p className="text-gray-600">
            Your AI-powered interview preparation platform.
          </p>
        </div>
      </main>
    </div>
  );
}