import { body } from "express-validator";

export const messageValidator = [
  body("body")
    .trim()
    .notEmpty()
    .withMessage("Message body is required.")
    .isLength({ max: 1000 })
    .withMessage("Message body must be 1000 characters or fewer.")
];
