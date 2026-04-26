import express from "express";
import {
  getMyListings,
  getProfile,
  updateProfile
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updateProfileValidator } from "../validators/userValidators.js";

const router = express.Router();

router.use(protect);
router.get("/profile", getProfile);
router.patch(
  "/profile",
  upload.single("avatar"),
  updateProfileValidator,
  validateRequest,
  updateProfile
);
router.get("/listings", getMyListings);

export default router;
