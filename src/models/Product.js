import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [{ type: String, trim: true }],
    customizationOptions: {
      available: { type: Boolean, default: false },
      options: [{ type: String }],
    },
    bulkOrderAvailable: { type: Boolean, default: false },
    minBulkQuantity: { type: Number, default: 10 },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    reviews: [ReviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isFeatured: 1, isBestSeller: 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
