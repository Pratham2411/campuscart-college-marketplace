import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { productValidator } from "../validators/productValidators.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:productId", getProductById);
router.post(
  "/",
  protect,
  upload.array("images", 6),
  productValidator,
  validateRequest,
  createProduct
);
router.patch(
  "/:productId",
  protect,
  upload.array("images", 6),
  productValidator,
  validateRequest,
  updateProduct
);
router.delete("/:productId", protect, deleteProduct);

export default router;
