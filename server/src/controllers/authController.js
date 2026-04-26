import User from "../models/User.js";
import { signToken } from "../services/tokenService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAssignedRole = (email) => {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase()) ? "admin" : "student";
};

const authPayload = (user) => ({
  token: signToken(user._id),
  user: user.toPublicJSON()
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: getAssignedRole(email)
  });

  res.status(201).json(authPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  res.json(authPayload(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    user: req.user.toPublicJSON()
  });
});
