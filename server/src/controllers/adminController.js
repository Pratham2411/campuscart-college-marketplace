import Product from "../models/Product.js";
import Report from "../models/Report.js";
import User from "../models/User.js";
import { removeProductAndAssociations } from "../services/productCleanupService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (_req, res) => {
  const [
    userCount,
    productCount,
    activeProductCount,
    reportCount,
    pendingReportCount,
    recentUsers,
    recentProducts
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Product.countDocuments({ status: "active" }),
    Report.countDocuments(),
    Report.countDocuments({ status: "pending" }),
    User.find().sort({ createdAt: -1 }).limit(5),
    Product.find().populate("seller", "name college").sort({ createdAt: -1 }).limit(5)
  ]);

  res.json({
    metrics: {
      userCount,
      productCount,
      activeProductCount,
      reportCount,
      pendingReportCount
    },
    recentUsers,
    recentProducts
  });
});

export const getUsers = asyncHandler(async (_req, res) => {
  const [users, listingCounts] = await Promise.all([
    User.find().sort({ createdAt: -1 }),
    Product.aggregate([
      {
        $group: {
          _id: "$seller",
          listingCount: { $sum: 1 }
        }
      }
    ])
  ]);

  const countMap = new Map(
    listingCounts.map((item) => [item._id.toString(), item.listingCount])
  );

  res.json({
    users: users.map((user) => ({
      ...user.toPublicJSON(),
      listingCount: countMap.get(user._id.toString()) || 0
    }))
  });
});

export const getProductsForAdmin = asyncHandler(async (_req, res) => {
  const products = await Product.find()
    .populate("seller", "name email college avatar role")
    .sort({ createdAt: -1 });

  res.json({ products });
});

export const getReportsForAdmin = asyncHandler(async (_req, res) => {
  const reports = await Report.find()
    .populate("product", "title status price images seller")
    .populate("reporter", "name email college")
    .sort({ createdAt: -1 });

  res.json({ reports });
});

export const deleteProductAsAdmin = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    throw new ApiError(404, "Listing not found.");
  }

  await removeProductAndAssociations(product);

  res.json({
    message: "Listing removed by admin."
  });
});

export const updateReportStatus = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.reportId);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  report.status = req.body.status;
  await report.save();

  res.json({
    message: "Report status updated.",
    report
  });
});
