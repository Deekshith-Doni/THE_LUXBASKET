import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  customization: { type: String },
});

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online", "bank_transfer"],
      default: "cod",
    },
    notes: { type: String },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true },
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
