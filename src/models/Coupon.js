import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: { type: String, required: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date, required: true },
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true },
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
export default Coupon;
