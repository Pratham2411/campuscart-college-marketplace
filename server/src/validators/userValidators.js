import { body } from "express-validator";

export const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty."),
  body("email")
    .optional()
    .isEmail()
    .withMessage("A valid email is required."),
  body("bio")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Bio must be 300 characters or fewer."),
  body("phone")
    .optional()
    .isLength({ max: 30 })
    .withMessage("Phone number is too long."),
  body("college")
    .optional()
    .isLength({ max: 120 })
    .withMessage("College name is too long.")
];
