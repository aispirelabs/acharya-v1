"use server"; // Still server actions, but their interaction with tokens will be different.

// We are removing Firebase, so db and auth from firebase/admin are no longer used here.
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

// Sign up a new user
export async function signUp(params: DjangoSignUpParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error signing up:", errorData);
      return {
        success: false,
        message: errorData.detail || errorData.email?.[0] || errorData.username?.[0] || "Sign up failed. Please check your input.",
        errors: errorData, // Pass along full error details
      };
    }

    // const data = await response.json(); // Django RegisterView usually returns user data or just 201
    return {
      success: true,
      message: "Account created successfully. Please sign in.",
      // user: data, // Depending on what your Django RegisterView returns
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
// This server action will return the tokens. The client component calling this action
// will be responsible for storing them in localStorage.
export async function signIn(params: DjangoSignInParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
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

    const tokens = await response.json(); // Expects { access: "...", refresh: "..." }

    // IMPORTANT: Client-side code that calls this signIn action needs to store these tokens.
    // e.g., localStorage.setItem('access_token', tokens.access);
    //       localStorage.setItem('refresh_token', tokens.refresh);

    return {
      success: true,
      message: "Signed in successfully.",
      tokens: tokens, // Return tokens to the client
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

// Sign out user - This action can't directly clear localStorage.
// The client should call this (if any server-side cleanup is needed, like token blacklisting)
// AND clear its own localStorage.
export async function signOut(accessToken?: string) {
  // If we implement server-side token blacklisting for refresh tokens with SimpleJWT,
  // this function would make an API call to that endpoint.
  // For now, it's mostly a placeholder if no server-side action for logout is configured.
  // The primary logout action (clearing tokens) happens on the client.
  console.log("User sign out action called. Client should clear tokens from localStorage.");
  // Example: if you had a blacklist endpoint (not set up by default with SimpleJWT core)
  // if (accessToken) {
  //   await fetch(`${API_BASE_URL}/users/logout/`, { // Assuming a /logout/ endpoint
  //     method: "POST",
  //     headers: { "Authorization": `Bearer ${accessToken}` }
  //   });
  // }
  return { success: true, message: "Sign out action completed. Client should ensure tokens are cleared." };
}

// Get current user profile from backend using an access token.
// The access token must be retrieved from localStorage by the client and passed to this action,
// or this function itself needs to be a client-side utility.
// Let's assume the token is passed if this is to remain a server action.
export async function getCurrentUser(accessToken: string | null): Promise<User | null> {
  if (!accessToken) {
    console.log("getCurrentUser: No access token provided.");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // This could be due to expired token, invalid token, etc.
      console.error("Error fetching current user:", response.status, await response.text());
      // Client should handle 401 by trying to refresh the token or prompting for login.
      return null;
    }

    const userData: User = await response.json();
    // Ensure the returned userData conforms to the User type, especially for 'id'
    // Django typically returns 'id', 'username', 'email', 'first_name', 'last_name', etc.
    // The User type in "@/types" might need adjustment.
    return userData;

  } catch (error) {
    console.error("Network or unexpected error fetching current user:", error);
    return null;
  }
}

// Check if user is authenticated - This is problematic for a server action
// if it relies on client-side localStorage.
// A true client-side version would check localStorage.
// This server action version is more of a placeholder or would need a token passed to it.
export async function isAuthenticated(accessToken: string | null): Promise<boolean> {
  if (!accessToken) return false;
  // A more robust check would be to verify the token's validity (e.g., by calling /api/token/verify/ if available)
  // or by actually fetching the user profile. For simplicity, we'll assume if a token exists, it's "authenticated"
  // The real test is if API calls with the token succeed.
  const user = await getCurrentUser(accessToken);
  return !!user;
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
      console.error("Error updating user avatar:", errorData);
      return { success: false, error: errorData.detail || "Failed to update avatar." };
    }

    const updatedUser = await response.json();
    return { success: true, message: "Your avatar was updated successfully!", user: updatedUser };

  } catch (error) {
    console.error("Network or unexpected error updating avatar:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// Function to refresh access token using the refresh token.
// The refresh token should be retrieved from localStorage by the client and passed here.
export async function refreshToken(refreshToken: string | null) {
  if (!refreshToken) {
    return { success: false, message: "No refresh token provided.", newAccessToken: null };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/login/refresh/`, { // Django SimpleJWT default refresh endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error refreshing token:", errorData);
      // This often means the refresh token is invalid or expired. Client should prompt for re-login.
      return { success: false, message: errorData.detail || "Failed to refresh token.", newAccessToken: null };
    }

    const { access: newAccessToken } = await response.json(); // Expects { access: "..." }

    // IMPORTANT: Client-side code that calls this refreshToken action needs to store this newAccessToken.
    // e.g., localStorage.setItem('access_token', newAccessToken);

    return { success: true, message: "Token refreshed successfully.", newAccessToken };

  } catch (error) {
    console.error("Network or unexpected error refreshing token:", error);
    return { success: false, message: "An unexpected error occurred.", newAccessToken: null };
  }
}
