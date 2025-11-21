// woodmart-api/src/controllers/orderController.js
import Order from "../models/Order.js";

export async function createOrder(req, res) {
  const order = await Order.create(req.body);
  res.status(201).json({ ok: true, id: order._id, order });
}