// import { auth, db } from "@/firebase/admin";
// import { cookies } from "next/headers"; // Will not use server-side session cookies for JWTs in this model

import { User } from "@/types"; // Assuming User type is compatible or will be updated

// Define a type for SignUpParams suitable for Django
// The old SignUpParams was { uid, name, email, password }
// Django's User model has username, email, password, first_name, last_name
export interface DjangoSignUpParams {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  photoURL?: string; // Assuming UserSerializer handles this
}

// Define a type for SignInParams suitable for Django
// The old SignInParams was { email, idToken }
export interface DjangoSignInParams {
  // Django's default TokenObtainPairView uses USERNAME_FIELD (default 'username') and password
  // It can be customized to use 'email'. We'll assume 'username' for now.
  username: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Helper function to safely access localStorage
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

// Sign up a new user
export async function signUp(params: DjangoSignUpParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error signing up:", errorData);
      return {
        success: false,
        message: errorData.detail || errorData.email?.[0] || errorData.username?.[0] || "Sign up failed. Please check your input.",
        errors: errorData,
      };
    }

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };

  } catch (error: unknown) {
    console.error("Network or unexpected error during sign up:", error);
    return {
      success: false,
      message: "An unexpected error occurred during sign up.",
    };
  }
}

// Sign in an existing user
export async function signIn(params: DjangoSignInParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error signing in:", errorData);
      return {
        success: false,
        message: errorData.detail || "Sign in failed. Check credentials.",
        tokens: null,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Signed in successfully.",
      tokens: {
        access: data.access,
        refresh: data.refresh
      },
      user: data.user
    };
  } catch (error: unknown) {
    console.error("Network or unexpected error during sign in:", error);
    return {
      success: false,
      message: "An unexpected error occurred during sign in.",
      tokens: null,
    };
  }
}

// Get current user profile from backend using an access token
export async function getCurrentUser(accessToken: string | null): Promise<User | null> {
  if (!accessToken) {
    accessToken = getLocalStorage('access_token');
    console.log("accessToken", accessToken);
  }
  
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid or expired
        return null;
      }
      console.error("Error fetching current user:", response.status);
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Network or unexpected error fetching current user:", error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated(accessToken: string | null): Promise<boolean> {
  if (!accessToken) {
    accessToken = getLocalStorage('access_token');
  }
  if (!accessToken) return false;
  const user = await getCurrentUser(accessToken);
  return !!user;
}

// Sign out user
export async function signOut(accessToken?: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  return { success: true, message: "Signed out successfully." };
}

// Refresh access token
export async function refreshToken(refreshToken: string | null) {
  if (!refreshToken) {
    refreshToken = getLocalStorage('refresh_token');
  }
  
  if (!refreshToken) {
    return { success: false, message: "No refresh token provided.", newAccessToken: null };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/login/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error refreshing token:", errorData);
      return { success: false, message: errorData.detail || "Failed to refresh token.", newAccessToken: null };
    }

    const { access: newAccessToken } = await response.json();
    return { success: true, message: "Token refreshed successfully.", newAccessToken };
  } catch (error) {
    console.error("Network or unexpected error refreshing token:", error);
    return { success: false, message: "An unexpected error occurred.", newAccessToken: null };
  }
}

// Update user avatar
export async function updateUserAvatar({
  // userId, // Django's profile update will use the authenticated user from the token.
  photoURL,
  accessToken,
}: {
  // userId: string; // Not needed if endpoint is /api/users/profile/ and PATCH uses authenticated user
  photoURL: string;
  accessToken: string | null;
}) {
  if (!accessToken) {
    return { success: false, error: "No access token provided." };
  }

  try {
    console.log("photoURL", photoURL);
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: "PATCH", // Use PATCH for partial updates
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ photoURL: photoURL }), // Send only the field to update
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating user avatar:", errorData, photoURL);
      return { success: false, error: errorData.detail || "Failed to update avatar." };
    }

    const updatedUser = await response.json();
    return { success: true, message: "Your avatar was updated successfully!", user: updatedUser };

  } catch (error) {
    console.error("Network or unexpected error updating avatar:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
