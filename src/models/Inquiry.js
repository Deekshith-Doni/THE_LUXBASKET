import mongoose, { Schema } from "mongoose";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    type: {
      type: String,
      enum: ["corporate", "wedding", "bulk", "custom", "general"],
      required: true,
    },
    eventDate: { type: Date },
    quantity: { type: Number, min: 1 },
    budget: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "completed", "cancelled"],
      default: "new",
    },
    adminNotes: { type: String },
  },
  { timestamps: true },
);

InquirySchema.index({ status: 1, createdAt: -1 });

const Inquiry =
  mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
export default Inquiry;
