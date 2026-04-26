import mongoose from "mongoose";
import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const syncProductRatings = async (productId) => {
  const [ratingStats] = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId)
      }
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: ratingStats ? Number(ratingStats.averageRating.toFixed(1)) : 0,
    reviewCount: ratingStats?.reviewCount || 0
  });
};

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("reviewer", "name avatar college")
    .sort({ createdAt: -1 });

  res.json({ reviews });
});

export const createOrUpdateReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product || product.status === "removed") {
    throw new ApiError(404, "Listing not found.");
  }

  if (product.seller.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot review your own listing.");
  }

  const update = {
    rating: Number(req.body.rating),
    comment: req.body.comment || ""
  };

  const review = await Review.findOneAndUpdate(
    { product: product._id, reviewer: req.user._id },
    update,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await syncProductRatings(product._id);

  const populatedReview = await review.populate("reviewer", "name avatar college");

  res.status(201).json({
    message: "Review saved successfully.",
    review: populatedReview
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found.");
  }

  const isOwner = review.reviewer.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw new ApiError(403, "You can only delete your own review.");
  }

  const productId = review.product;
  await Review.deleteOne({ _id: review._id });
  await syncProductRatings(productId);

  res.json({
    message: "Review deleted successfully."
  });
});
