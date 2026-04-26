import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    publicId: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair"],
      default: "Good"
    },
    campusLocation: {
      type: String,
      trim: true,
      default: "Main Campus"
    },
    images: {
      type: [imageSchema],
      default: []
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "sold", "removed"],
      default: "active"
    },
    averageRating: {
      type: Number,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    reportCount: {
      type: Number,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
