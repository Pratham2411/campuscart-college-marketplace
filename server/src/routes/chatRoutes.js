import express from "express";
import {
  getConversations,
  getThread,
  markThreadAsRead,
  sendMessage
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { messageValidator } from "../validators/messageValidators.js";

const router = express.Router();

router.use(protect);
router.get("/conversations", getConversations);
router.get("/thread/:productId/:participantId", getThread);
router.post(
  "/thread/:productId/:participantId",
  messageValidator,
  validateRequest,
  sendMessage
);
router.patch("/thread/:productId/:participantId/read", markThreadAsRead);

export default router;
