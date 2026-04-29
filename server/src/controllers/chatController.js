import Message from "../models/Message.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildConversationKey = (productId, firstUserId, secondUserId) => {
  const [a, b] = [firstUserId.toString(), secondUserId.toString()].sort();
  return `${productId}:${a}:${b}`;
};

const assertMessagingRights = (reqUserId, productSellerId, otherUserId) => {
  const requester = reqUserId.toString();
  const seller = productSellerId.toString();
  const other = otherUserId.toString();

  if (requester === other) {
    throw new ApiError(400, "You cannot send messages to yourself.");
  }

  if (requester !== seller && other !== seller) {
    throw new ApiError(
      403,
      "Students can only start a conversation with the product seller."
    );
  }
};

export const getConversations = asyncHandler(async (req, res) => {
  const messages = await Message.find({ participants: req.user._id })
    .sort({ createdAt: -1 })
    .populate("product", "title images price status")
    .populate("sender", "name avatar college")
    .populate("receiver", "name avatar college");

  const conversationMap = new Map();

  messages.forEach((message) => {
    if (conversationMap.has(message.conversationKey)) {
      return;
    }

    const otherUser =
      message.sender._id.toString() === req.user._id.toString()
        ? message.receiver
        : message.sender;

    conversationMap.set(message.conversationKey, {
      key: message.conversationKey,
      product: message.product,
      latestMessage: message,
      otherUser
    });
  });

  const conversations = await Promise.all(
    Array.from(conversationMap.values()).map(async (conversation) => {
      const unreadCount = await Message.countDocuments({
        conversationKey: conversation.key,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id }
      });

      return {
        ...conversation,
        unreadCount
      };
    })
  );

  res.json({ conversations });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({
    receiver: req.user._id,
    readBy: { $ne: req.user._id }
  });

  res.json({ count });
});

export const getThread = asyncHandler(async (req, res) => {
  const { productId, participantId } = req.params;
  const conversationKey = buildConversationKey(
    productId,
    req.user._id,
    participantId
  );

  const messages = await Message.find({ conversationKey })
    .sort({ createdAt: 1 })
    .populate("sender", "name avatar college")
    .populate("receiver", "name avatar college")
    .populate("product", "title images price");

  res.json({ messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { productId, participantId } = req.params;
  const product = await Product.findById(productId);

  if (!product || product.status === "removed") {
    throw new ApiError(404, "Listing not found.");
  }

  assertMessagingRights(req.user._id, product.seller, participantId);

  const conversationKey = buildConversationKey(
    product._id,
    req.user._id,
    participantId
  );

  const message = await Message.create({
    product: product._id,
    sender: req.user._id,
    receiver: participantId,
    participants: [req.user._id, participantId],
    conversationKey,
    body: req.body.body,
    readBy: [req.user._id]
  });

  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "name avatar college")
    .populate("receiver", "name avatar college")
    .populate("product", "title images price");

  res.status(201).json({
    message: "Message sent successfully.",
    payload: populatedMessage
  });
});

export const markThreadAsRead = asyncHandler(async (req, res) => {
  const { productId, participantId } = req.params;
  const conversationKey = buildConversationKey(
    productId,
    req.user._id,
    participantId
  );

  await Message.updateMany(
    {
      conversationKey,
      sender: { $ne: req.user._id }
    },
    {
      $addToSet: { readBy: req.user._id }
    }
  );

  res.json({
    message: "Thread marked as read."
  });
});
