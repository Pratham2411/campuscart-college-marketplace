import Message from "../models/Message.js";
import Product from "../models/Product.js";
import Report from "../models/Report.js";
import Review from "../models/Review.js";
import Wishlist from "../models/Wishlist.js";
import { deleteCloudinaryAssets } from "./cloudinaryService.js";

export const removeProductAndAssociations = async (product) => {
  if (!product) {
    return;
  }

  await deleteCloudinaryAssets(product.images);

  await Promise.all([
    Review.deleteMany({ product: product._id }),
    Message.deleteMany({ product: product._id }),
    Report.deleteMany({ product: product._id }),
    Wishlist.updateMany({}, { $pull: { items: product._id } }),
    Product.deleteOne({ _id: product._id })
  ]);
};
