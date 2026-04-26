import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import User from "../models/User.js";
import {
  deleteCloudinaryAssets,
  uploadImagesToCloudinary
} from "../services/cloudinaryService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const [listingCount, wishlist] = await Promise.all([
    Product.countDocuments({ seller: req.user._id }),
    Wishlist.findOne({ user: req.user._id })
  ]);

  res.json({
    user: req.user.toPublicJSON(),
    stats: {
      listingCount,
      wishlistCount: wishlist?.items.length || 0
    }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, bio, college, phone } = req.body;

  if (email && email.toLowerCase() !== req.user.email) {
    const emailInUse = await User.findOne({ email: email.toLowerCase() });
    if (emailInUse) {
      throw new ApiError(409, "That email address is already in use.");
    }
    req.user.email = email.toLowerCase();
  }

  req.user.name = name ?? req.user.name;
  req.user.bio = bio ?? req.user.bio;
  req.user.college = college ?? req.user.college;
  req.user.phone = phone ?? req.user.phone;

  if (req.file) {
    const [avatarImage] = await uploadImagesToCloudinary(
      [req.file],
      `${process.env.CLOUDINARY_FOLDER || "college-marketplace"}/avatars`
    );

    await deleteCloudinaryAssets(req.user.avatar?.publicId ? [req.user.avatar] : []);
    req.user.avatar = avatarImage;
  }

  await req.user.save();

  res.json({
    message: "Profile updated successfully.",
    user: req.user.toPublicJSON()
  });
});

export const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Product.find({ seller: req.user._id })
    .sort({ createdAt: -1 })
    .populate("seller", "name email college avatar");

  res.json({ listings });
});
