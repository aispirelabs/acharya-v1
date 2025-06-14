"use client";

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
// Removed: import { signOut } from '@/lib/actions/auth.action';
import { useAuth } from '@/lib/context/AuthContext'; // Import useAuth

const SignOutButton = () => {
  // Removed: const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut: contextSignOut } = useAuth(); // Get signOut from context

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await contextSignOut(); // Call signOut from AuthContext
      toast.success('Signed out successfully');
      // Redirection is handled by signOutAndRedirect within AuthContext's signOut method
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
      // It's possible that signOutAndRedirect in apiClient already handles errors,
      // but an additional catch here can handle UI-specific error feedback.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleSignOut}
      disabled={isLoading}
      className="text-gray-600 hover:text-primary-100 hover:text-gray-900 cursor-pointer"
      title="Sign out"
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-current rounded-full border-t-transparent"></span>
      ) : (
        <LogOut size={20} />
      )}
    </Button>
  );
};

export default SignOutButton;