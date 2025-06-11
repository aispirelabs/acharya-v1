"use client";

import Link from "next/link";
import { User } from "@/types";
import SignOutButton from "./SignOutButton";
import AvatarPicker from "./avatar/AvatarPicker";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  if (!user) return null;

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-bold gradient-text">
            AcharyaAI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/interview"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Start New Interview
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-lg font-medium hover:text-gray-900">
                {user.name}
              </span>
              <AvatarPicker
                currentAvatar={user.avatar || "/user-avatar.jpg"}
                userId={user.id}
                userName={user.name}
              />
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 