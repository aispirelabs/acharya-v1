"use client";

import { useState, useEffect } from 'react'; // Added useEffect for potential client-side user updates
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, User as UserIcon } from 'lucide-react'; // Renamed User to UserIcon to avoid conflict
import { signOut } from '@/lib/actions/auth.action'; // Server action
// To get current user on client side, you'd typically use a context or a client-side hook.
// For this refactor, props are still passed from a server component parent.

interface MobileNavProps {
  // These props will be derived from the User object (which might be null initially)
  // in the parent server component (app/(root)/layout.tsx)
  userName: string;
  userAvatar: string;
}

const MobileNav = ({ userName, userAvatar }: MobileNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Note: A more robust solution involves a global auth context/state.
  // This component relies on props passed from its parent.
  // If userName is empty, it implies no user is effectively logged in for this component's display.

  const handleSignOut = async () => {
    try {
      // Call the server action (optional, if it does any server-side cleanup like token blacklisting)
      await signOut();

      // Clear client-side tokens
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setIsMenuOpen(false); // Close menu before redirecting
      window.location.href = '/sign-in'; // Force reload and redirect
    } catch (error) {
      console.error('Error signing out:', error);
      // Potentially show a toast message
    }
  };

  // If no userName, perhaps don't render the mobile nav button, or render a login button
  if (!userName) {
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
          src={userAvatar || '/user-avatar.jpg'} // Fallback
          alt={userName || "User"}
          width={32}
          height={32}
          className="rounded-full object-cover border-2 border-gray-200"
        />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
          </div>
          <div className="py-1">
            <Link
              href="/interview"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Start New Interview
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
};

export default MobileNav;
