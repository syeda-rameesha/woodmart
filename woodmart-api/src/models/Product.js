// woodmart-api/src/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    category: { type: String, required: true },

    image: { type: String, required: true },
    images: [{ type: String }],

    description: { type: String },

    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ named export and default export
export const Product = mongoose.model("Product", productSchema);
export default Product;