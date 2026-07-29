import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection established");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
}
