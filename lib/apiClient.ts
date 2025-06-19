const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

export const setTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }
};

export const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// Main function for making API requests
export const request = async (method: string, path: string, body?: any): Promise<any> => {
  let accessToken = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // Important for CORS and cookies
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response = await fetch(`${API_BASE_URL}${path}`, config);

  if (response.status === 401) {
    console.log("Access token expired or invalid. Attempting to refresh...");
    const newAccessToken = await handleRefreshToken();

    if (newAccessToken) {
      // Retry the request with the new token
      headers["Authorization"] = `Bearer ${newAccessToken}`;
      config.headers = headers; // Update headers in config
      console.log("Retrying request with new access token...");
      response = await fetch(`${API_BASE_URL}${path}`, config);
    } else {
      // If token refresh failed and user is not redirected yet by handleRefreshToken
      console.log("Token refresh failed. User should be signed out.");
      // signOutAndRedirect is called within handleRefreshToken if refresh fails
      // Return a promise that rejects to indicate failure to the caller
      return Promise.reject(new Error("Token refresh failed and user signed out."));
    }
  }

  if (!response.ok) {
    // Handle other non-successful responses
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    console.log("API request error:", errorData);
    throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
  }

  // If response has no content, return null or a specific success indicator
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json(); // Parse JSON only if content type is JSON
  } else if (response.status === 204 || response.status === 201 && !contentType) {
    return null; // No content or content type not set but successful
  }

  // For non-JSON responses, return text or blob as needed, or handle appropriately
  // For now, if not JSON and not a 'no content' status, this might be an issue or needs specific handling
  return response.text().then(text => { // Or response.blob(), response.arrayBuffer() etc.
    try {
      // Attempt to parse as JSON if text looks like it, otherwise return text
      return JSON.parse(text);
    } catch (e) {
      return text; // Return as plain text if not valid JSON
    }
  }).catch(() => null); // Catch if text() itself fails or if body is empty
};

// Function to clear tokens and redirect to sign-in
// Exported for potential use in UI components (e.g., sign out button)
export const signOutAndRedirect = (): void => {
  clearTokens();
  if (typeof window !== 'undefined') {
    // In a Next.js app, you would typically use useRouter() from 'next/navigation'
    // for client-side navigation to ensure SPA behavior.
    // Example: router.push('/sign-in');
    // For this generic module, window.location.href is a fallback.
    window.location.href = '/sign-in';
  }
};

// Function to refresh the access token
const handleRefreshToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.log("No refresh token available.");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/login/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
      credentials: 'include', // Important for sending cookies if your backend uses them
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error refreshing token:", errorData);
      // If refresh fails (e.g., refresh token is invalid/expired), sign out user
      signOutAndRedirect();
      return null;
    }

    const { access: newAccessToken } = await response.json();
    if (newAccessToken) {
      setTokens(newAccessToken); // Only refresh_token is not typically sent back, so only update access_token
      console.log("Token refreshed successfully.");
      return newAccessToken;
    } else {
      console.error("New access token not found in refresh response.");
      signOutAndRedirect();
      return null;
    }
  } catch (error) {
    console.error("Network or unexpected error during token refresh:", error);
    signOutAndRedirect();
    return null;
  }
};

export default request;
