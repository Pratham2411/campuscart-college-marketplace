import express from "express";
import { createReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { reportValidator } from "../validators/reportValidators.js";

const router = express.Router();

router.post(
  "/product/:productId",
  protect,
  reportValidator,
  validateRequest,
  createReport
);

export default router;
