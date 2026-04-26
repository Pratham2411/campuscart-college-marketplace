import express from "express";
import {
  deleteProductAsAdmin,
  getDashboard,
  getProductsForAdmin,
  getReportsForAdmin,
  getUsers,
  updateReportStatus
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { reportStatusValidator } from "../validators/reportValidators.js";

const router = express.Router();

router.use(protect, requireAdmin);
router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/products", getProductsForAdmin);
router.get("/reports", getReportsForAdmin);
router.delete("/products/:productId", deleteProductAsAdmin);
router.patch(
  "/reports/:reportId",
  reportStatusValidator,
  validateRequest,
  updateReportStatus
);

export default router;
