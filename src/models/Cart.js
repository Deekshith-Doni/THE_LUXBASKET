import mongoose, { Schema } from "mongoose";

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  customization: { type: String },
  price: { type: Number, required: true },
});

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true },
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
export default Cart;
