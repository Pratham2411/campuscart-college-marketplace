import dotenv from "dotenv";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

const shutdown = async () => {
  try {
    await disconnectDB();
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
