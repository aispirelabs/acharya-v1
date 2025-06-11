require('dotenv').config({ path: '.env.local' });
const { db } = require("../firebase/admin");

async function initializeFirestore() {
  try {
    console.log("Starting Firestore initialization...");
    
    // Create users collection with a test user
    const usersCollection = db.collection("users");
    await usersCollection.doc("test-user").set({
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date().toISOString(),
      authProvider: "email",
      photoURL: "/user-avatar.jpg"
    });
    console.log("Created users collection with test user");

    // Create interviews collection with a test interview
    const interviewsCollection = db.collection("interviews");
    await interviewsCollection.doc("test-interview").set({
      role: "Software Engineer",
      type: "technical",
      level: "mid-level",
      techstack: ["javascript", "react", "nodejs"],
      questions: ["What is React?", "Explain Node.js architecture"],
      userId: "test-user",
      finalized: true,
      coverImage: "/interview-cover.jpg",
      createdAt: new Date().toISOString()
    });
    console.log("Created interviews collection with test interview");

    // Create feedback collection with test feedback
    const feedbackCollection = db.collection("feedback");
    await feedbackCollection.doc("test-feedback").set({
      interviewId: "test-interview",
      userId: "test-user",
      totalScore: 85,
      categoryScores: [
        {
          name: "Technical Knowledge",
          score: 90,
          comment: "Strong understanding of core concepts"
        },
        {
          name: "Problem Solving",
          score: 85,
          comment: "Good analytical approach"
        }
      ],
      strengths: ["Clear communication", "Good technical knowledge"],
      areasForImprovement: ["Could provide more detailed examples"],
      finalAssessment: "Overall strong performance with room for improvement in providing detailed examples.",
      createdAt: new Date().toISOString()
    });
    console.log("Created feedback collection with test feedback");

    console.log("Firestore collections initialized successfully");
  } catch (error) {
    console.error("Error initializing Firestore:", error);
    process.exit(1);
  }
}

// Run the initialization
initializeFirestore(); 