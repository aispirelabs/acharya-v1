"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import InterviewFormDialog from "./interview/InterviewFormDialog";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  if (!user) {
    // Or return a login link, or nothing, depending on desired UX for unauthenticated mobile users
    return null;
  }

  return (
    <div className="md:hidden relative">
      <button
        type="button"
        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Image
          src={user.photo_url || '/user-avatar.jpg'} // Fallback
          alt={user.first_name || user.username || "User"}
          width={32}
          height={32}
          className="rounded-full object-cover border-2 border-gray-200"
        />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.first_name || user.username}</p>
          </div>
          <div className="py-1">
            <InterviewFormDialog />
            <Link
              href="/my-interviews"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              My Interviews
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
