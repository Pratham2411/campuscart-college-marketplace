import express from "express";
import {
  createOrUpdateReview,
  deleteReview,
  getProductReviews
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { reviewValidator } from "../validators/reviewValidators.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post(
  "/product/:productId",
  protect,
  reviewValidator,
  validateRequest,
  createOrUpdateReview
);
router.delete("/:reviewId", protect, deleteReview);

export default router;
