import Product from "../models/Product.js";
import Report from "../models/Report.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createReport = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product || product.status === "removed") {
    throw new ApiError(404, "Listing not found.");
  }

  if (product.seller.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot report your own listing.");
  }

  const existingReport = await Report.findOne({
    product: product._id,
    reporter: req.user._id
  });

  if (existingReport) {
    throw new ApiError(409, "You have already reported this listing.");
  }

  const report = await Report.create({
    product: product._id,
    reporter: req.user._id,
    reason: req.body.reason,
    details: req.body.details || ""
  });

  product.reportCount += 1;
  await product.save();

  res.status(201).json({
    message: "Report submitted successfully.",
    report
  });
});
