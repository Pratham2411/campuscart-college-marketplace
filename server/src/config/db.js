import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "college-marketplace"
      }
    });
    mongoUri = memoryServer.getUri();
    console.log("Using in-memory MongoDB for local development.");
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true
    });

    console.log(`MongoDB connected on ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();

  if (memoryServer) {
    await memoryServer.stop();
  }
};
