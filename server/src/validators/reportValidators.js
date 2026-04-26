import { body } from "express-validator";

export const reportValidator = [
  body("reason").trim().notEmpty().withMessage("Reason is required."),
  body("details")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Details must be 500 characters or fewer."),
  body("status")
    .optional()
    .isIn(["pending", "resolved", "rejected"])
    .withMessage("Status is invalid.")
];

export const reportStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["pending", "resolved", "rejected"])
    .withMessage("Status is invalid.")
];
