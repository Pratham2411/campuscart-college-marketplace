import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true
    },
    conversationKey: {
      type: String,
      required: true,
      index: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Message", messageSchema);
