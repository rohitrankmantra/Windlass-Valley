import mongoose from "mongoose";

let isConnected = false; 

export async function connectDB() {
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "realestate", 
    });
    isConnected = true;
    console.log("🚀 MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
