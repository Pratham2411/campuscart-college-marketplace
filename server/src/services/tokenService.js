import jwt from "jsonwebtoken";

export const signToken = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_SECRET || "development_jwt_secret_change_me",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    }
  );
