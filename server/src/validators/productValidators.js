import { body } from "express-validator";

export const productValidator = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long."),
  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("condition")
    .optional()
    .isIn(["New", "Like New", "Good", "Fair"])
    .withMessage("Condition is invalid."),
  body("campusLocation")
    .optional()
    .isLength({ max: 120 })
    .withMessage("Campus location is too long.")
];
