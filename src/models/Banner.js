import mongoose, { Schema } from "mongoose";

const BannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    image: { type: String, required: true },
    mobileImage: { type: String },
    link: { type: String },
    buttonText: { type: String, default: "Shop Now" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
export default Banner;
