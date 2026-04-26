import { ApiError } from "../utils/ApiError.js";

export const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    next(new ApiError(403, "Admin access is required."));
    return;
  }

  next();
};
