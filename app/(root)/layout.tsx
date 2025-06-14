"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    // Enhanced loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-100">
        <div className="flex flex-col items-center">
          {/* You can use a simple spinner here if available as a component, or just text */}
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading your experience...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <MobileNav userName={user.first_name || user.username} userAvatar={user.photoURL || ""} />
      {children}
    </div>
  );
}