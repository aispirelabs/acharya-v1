"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/auth.action'; // This is the server action

const SignOutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);

      // Call the server action (optional, if it performs server-side cleanup like token blacklisting)
      // The current refactored signOut server action is mostly a placeholder.
      await signOut();

      // Clear client-side tokens - THIS IS THE KEY CHANGE
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      toast.success('Signed out successfully');
      router.push('/sign-in'); // Redirect to sign-in page
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
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