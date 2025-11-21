// woodmart-api/src/models/Order.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: String,
    title: String,
    slug: String,
    image: String,
    price: Number,
    qty: Number,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      email: String,
      phone: String,
      address1: String,
      address2: String,
      city: String,
      country: String,
      zip: String,
    },
    shipping: { method: String, fee: Number },
    payment: { method: String, status: { type: String, default: "unpaid" } },
    items: [OrderItemSchema],
    amounts: {
      subtotal: Number,
      shipping: Number,
      total: Number,
    },
    status: { type: String, default: "new" }, // new, processing, shipped, cancelled
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);