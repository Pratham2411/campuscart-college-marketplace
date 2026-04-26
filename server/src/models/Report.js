import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    details: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ product: 1, reporter: 1 }, { unique: true });

export default mongoose.model("Report", reportSchema);
