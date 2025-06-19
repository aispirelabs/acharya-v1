'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
// Removed: import { getCurrentUser, signOut } from '@/lib/actions/auth.action';
import { getAccessToken, request, signOutAndRedirect } from '@/lib/apiClient'; // Import apiClient functions
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>; // Renamed from handleSignOut to match context value
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  checkAuth: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Keep for potential future use if signOutAndRedirect behavior changes

  const checkAuth = async () => {
    setLoading(true); // Ensure loading is true at the start of auth check
    try {
      const accessToken = getAccessToken(); // Use apiClient
      
      if (accessToken) {
        // Assuming a /users/profile/ endpoint exists for fetching user data
        const userData = await request('GET', '/users/profile/');
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      // Optionally, if profile fetch fails due to 401, apiClient's request function
      // would have tried to refresh and then signOutAndRedirect if refresh failed.
      // If it's another error, user is set to null.
    } finally {
      setLoading(false);
    }
  };

  const performSignOut = async () => { // Renamed from handleSignOut
    try {
      await signOutAndRedirect(); // Use apiClient's signOutAndRedirect
      setUser(null); // Ensure local state is cleared
      // router.push('/sign-in'); // This is now handled by signOutAndRedirect
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if signOutAndRedirect fails (e.g. network error before redirect), clear user state
      setUser(null);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, signOut: performSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 