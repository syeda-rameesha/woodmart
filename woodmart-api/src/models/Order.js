// woodmart-api/src/models/Order.js
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String },
    title: { type: String },
    slug: { type: String },
    image: { type: String },
    price: { type: Number },
    qty: { type: Number },
  },
  { _id: false }
);

// Allowed statuses — include 'pending' because some routes use it.
// Keep values that your admin UI expects: pending, processing, shipped, delivered, cancelled, new
const STATUS_ENUM = ["new", "pending", "processing", "shipped", "delivered", "cancelled"];

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      country: { type: String },
      zip: { type: String },
    },
    shipping: { method: String, fee: Number },
    payment: {
      method: String,
      status: { type: String, default: "unpaid" }, // e.g. unpaid / paid
    },
    items: [OrderItemSchema],
    amounts: {
      subtotal: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    // Use enum so only known statuses are stored
    status: { type: String, enum: STATUS_ENUM, default: "pending" },
  },
  { timestamps: true }
);

// export (handle model recompilation in dev/hot reload)
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);