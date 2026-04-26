import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new ApiError(422, "Validation failed.", errors.array()));
    return;
  }

  next();
};
