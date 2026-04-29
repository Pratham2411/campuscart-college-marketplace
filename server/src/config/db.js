import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const createMemoryUri = async () => {
  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: "college-marketplace"
    }
  });
  console.log("Using in-memory MongoDB for local development.");
  return memoryServer.getUri();
};

export const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    mongoUri = await createMemoryUri();
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true
    });

    console.log(`MongoDB connected on ${mongoose.connection.host}`);
  } catch (error) {
    const canFallbackToMemory = process.env.NODE_ENV !== "production" && process.env.MONGO_FALLBACK !== "false";

    if (!canFallbackToMemory || !process.env.MONGO_URI) {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    }

    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn("Falling back to in-memory MongoDB for this local session.");

    mongoUri = await createMemoryUri();
    await mongoose.connect(mongoUri, {
      autoIndex: true
    });

    console.log(`MongoDB connected on ${mongoose.connection.host}`);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();

  if (memoryServer) {
    await memoryServer.stop();
  }
};
