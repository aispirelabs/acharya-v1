"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';
import { signOut } from '@/lib/actions/auth.action';

interface MobileNavProps {
  userName: string;
  userAvatar: string;
}

const MobileNav = ({ userName, userAvatar }: MobileNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="md:hidden relative">
      {/* Profile Image Button */}
      <button
        type="button"
        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Image
          src={userAvatar || '/user-avatar.jpg'}
          alt={userName}
          width={32}
          height={32}
          className="rounded-full object-cover border-2 border-gray-200"
        />
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
          {/* User Info */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/interview"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4 mr-2" />
              Start New Interview
            </Link>
            
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleSignOut();
              }}
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