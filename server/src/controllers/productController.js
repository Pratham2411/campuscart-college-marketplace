import Product from "../models/Product.js";
import { removeProductAndAssociations } from "../services/productCleanupService.js";
import {
  deleteCloudinaryAssets,
  uploadImagesToCloudinary
} from "../services/cloudinaryService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sellerProjection = "name email college avatar role";

const parseArrayField = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return String(value)
      .split("\n")
      .flatMap((entry) => entry.split(","))
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
};

const normalizeTags = (value) =>
  parseArrayField(value).map((tag) => String(tag).trim()).filter(Boolean);

const normalizeManualImages = (value) =>
  parseArrayField(value)
    .map((item) =>
      typeof item === "string"
        ? { url: item.trim(), publicId: "" }
        : { url: item.url?.trim(), publicId: item.publicId || "" }
    )
    .filter((image) => image.url);

const parseExistingImages = (value, currentImages) => {
  if (!value) {
    return currentImages;
  }

  const keepers = parseArrayField(value);
  const keysToKeep = new Set(
    keepers.map((item) =>
      typeof item === "string" ? item : item.publicId || item.url || ""
    )
  );

  return currentImages.filter(
    (image) => keysToKeep.has(image.publicId) || keysToKeep.has(image.url)
  );
};

const buildProductFilters = (query, isAdminRequest = false) => {
  const filters = {};

  if (!isAdminRequest) {
    filters.status = "active";
  }

  if (query.category && query.category !== "All") {
    filters.category = query.category;
  }

  if (query.seller) {
    filters.seller = query.seller;
  }

  if (query.status && isAdminRequest) {
    filters.status = query.status;
  }

  if (query.search) {
    const matcher = { $regex: query.search, $options: "i" };
    filters.$or = [
      { title: matcher },
      { description: matcher },
      { category: matcher },
      { tags: matcher }
    ];
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) {
      filters.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      filters.price.$lte = Number(query.maxPrice);
    }
  }

  return filters;
};

const getSortOption = (sortBy) => {
  const options = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { averageRating: -1, createdAt: -1 }
  };

  return options[sortBy] || options.latest;
};

export const createProduct = asyncHandler(async (req, res) => {
  const uploadedImages = await uploadImagesToCloudinary(req.files || []);
  const manualImages = normalizeManualImages(req.body.imageUrls);
  const images = [...manualImages, ...uploadedImages];

  if (!images.length) {
    throw new ApiError(
      400,
      "Please upload at least one image or provide a hosted image URL."
    );
  }

  const product = await Product.create({
    title: req.body.title,
    description: req.body.description,
    price: Number(req.body.price),
    category: req.body.category,
    condition: req.body.condition || "Good",
    campusLocation: req.body.campusLocation || "Main Campus",
    tags: normalizeTags(req.body.tags),
    images,
    seller: req.user._id
  });

  const populatedProduct = await product.populate("seller", sellerProjection);

  res.status(201).json({
    message: "Listing created successfully.",
    product: populatedProduct
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 12, 36);
  const skip = (page - 1) * limit;
  const filters = buildProductFilters(req.query);
  const sort = getSortOption(req.query.sortBy);

  const [products, total, categories] = await Promise.all([
    Product.find(filters)
      .populate("seller", sellerProjection)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filters),
    Product.distinct("category", { status: "active" })
  ]);

  res.json({
    products,
    categories: categories.sort(),
    pagination: {
      page,
      total,
      pages: Math.ceil(total / limit),
      limit
    }
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate(
    "seller",
    sellerProjection
  );

  if (!product || product.status === "removed") {
    throw new ApiError(404, "Listing not found.");
  }

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    status: "active"
  })
    .populate("seller", sellerProjection)
    .sort({ createdAt: -1 })
    .limit(4);

  res.json({
    product,
    relatedProducts
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new ApiError(404, "Listing not found.");
  }

  const isOwner = product.seller.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw new ApiError(403, "You can only edit your own listings.");
  }

  const keptImages = parseExistingImages(req.body.existingImages, product.images);
  const removedImages = product.images.filter(
    (image) =>
      !keptImages.some(
        (keeper) =>
          keeper.url === image.url && keeper.publicId === image.publicId
      )
  );
  const uploadedImages = await uploadImagesToCloudinary(req.files || []);
  const manualImages = normalizeManualImages(req.body.imageUrls);
  const images = [...keptImages, ...manualImages, ...uploadedImages];

  if (!images.length) {
    throw new ApiError(400, "A listing must have at least one image.");
  }

  product.images = images;
  product.title = req.body.title ?? product.title;
  product.description = req.body.description ?? product.description;
  product.price = req.body.price ? Number(req.body.price) : product.price;
  product.category = req.body.category ?? product.category;
  product.condition = req.body.condition ?? product.condition;
  product.campusLocation = req.body.campusLocation ?? product.campusLocation;
  product.tags = req.body.tags ? normalizeTags(req.body.tags) : product.tags;
  product.status = req.body.status ?? product.status;

  await product.save();
  await deleteCloudinaryAssets(removedImages);
  await product.populate("seller", sellerProjection);

  res.json({
    message: "Listing updated successfully.",
    product
  });
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new ApiError(404, "Listing not found.");
  }

  const isOwner = product.seller.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw new ApiError(403, "You can only update your own listings.");
  }

  product.status = req.body.status === "sold" ? "sold" : "active";
  await product.save();
  await product.populate("seller", sellerProjection);

  res.json({
    message: `Listing marked as ${product.status}.`,
    product
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new ApiError(404, "Listing not found.");
  }

  const isOwner = product.seller.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    throw new ApiError(403, "You can only delete your own listings.");
  }

  await removeProductAndAssociations(product);

  res.json({
    message: "Listing deleted successfully."
  });
});
