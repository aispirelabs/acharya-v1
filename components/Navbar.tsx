"use client";

import Link from "next/link";
import { User } from "@/types"; // User type now has snake_case fields from Django
import SignOutButton from "./SignOutButton"; // Assuming SignOutButton handles its own token clearing or calls an action
import AvatarPicker from "./avatar/AvatarPicker";
import InterviewFormDialog from "./interview/InterviewFormDialog";

interface NavbarProps {
  user: User | null; // User type has been updated (snake_case fields)
}

export default function Navbar({ user }: NavbarProps) {
  // The component already correctly handles user being null by returning null.
  if (!user) return null;
  console.log("user navbar", user);

  // Use appropriate fields from the updated User type
  const displayName = user.first_name || user.username || "User";
  const avatarUrl = user.photoURL || "/user-avatar.jpg"; // photo_url from Django

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/dashboard" className="text-2xl font-bold gradient-text">
            AcharyaAI
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <InterviewFormDialog trigger={
              <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                Start New Interview
              </button>
            } />
            <Link
              href="/my-interviews"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              My Interviews
            </Link>
            
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-lg font-medium hover:text-gray-900">
                {displayName}
              </span>
              <AvatarPicker
                currentAvatar={avatarUrl}
                userId={user.id as string} // Assuming user.id is string (UUID from Django)
                userName={displayName}
              />
              {/* SignOutButton might need to be refactored if it directly used Firebase or old actions */}
              {/* For now, assuming SignOutButton is compatible or will be handled separately */}
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
