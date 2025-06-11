import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import 'dotenv/config';

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  try {
    const apps = getApps();
    console.log("Checking existing Firebase apps:", apps.length);

    if (!apps.length) {
      console.log("Initializing Firebase Admin SDK");
      
      // Make sure the private key is properly formatted
      const privateKey = process.env.FIREBASE_PRIVATE_KEY 
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
        : undefined;
      
      // Log environment variables for debugging (without sensitive data)
      console.log("Environment variables status:");
      console.log("- FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID ? "Set" : "Not set");
      console.log("- FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL ? "Set" : "Not set");
      console.log("- FIREBASE_PRIVATE_KEY:", privateKey ? "Set" : "Not set");
      
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        throw new Error('Missing required Firebase Admin SDK credentials. Please check your .env.local file.');
      }

      const app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      
      console.log("Firebase Admin SDK initialized successfully");
      return app;
    } else {
      console.log("Firebase Admin SDK already initialized");
      return apps[0];
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error;
  }
}

// Initialize the app
let app;
try {
  app = initFirebaseAdmin();
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
  throw error;
}

// Initialize auth and firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized instances
export { auth, db };