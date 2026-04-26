import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: "items",
    match: { status: "active" },
    populate: {
      path: "seller",
      select: "name college avatar"
    }
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    wishlist = await wishlist.populate({
      path: "items",
      populate: { path: "seller", select: "name college avatar" }
    });
  }

  res.json({ wishlist });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product || product.status !== "active") {
    throw new ApiError(404, "Listing not found.");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  const alreadySaved = wishlist.items.some(
    (item) => item.toString() === product._id.toString()
  );

  if (alreadySaved) {
    wishlist.items = wishlist.items.filter(
      (item) => item.toString() !== product._id.toString()
    );
  } else {
    wishlist.items.push(product._id);
  }

  await wishlist.save();

  res.json({
    message: alreadySaved
      ? "Removed from wishlist."
      : "Added to wishlist.",
    isWishlisted: !alreadySaved
  });
});
