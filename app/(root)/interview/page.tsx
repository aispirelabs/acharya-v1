"use client";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import CreateInterviewForm from "@/components/CreateInterviewForm";
import { useEffect, useState } from "react";
import { User } from "@/types";

function InterviewContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        redirect("/sign-in");
      }
      setUser(currentUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Start New Interview</h1>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-6">
              Create a new interview by filling out the form below. You can specify the role, type, level, 
              and tech stack for your interview. The AI will generate relevant questions based on your inputs.
            </p>
            <CreateInterviewForm userId={user.id} isModal={false} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function InterviewPage() {
  return <InterviewContent />;
}