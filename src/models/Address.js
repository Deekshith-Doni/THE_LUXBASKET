import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, default: "Home", trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

AddressSchema.index({ user: 1 });

const Address =
  mongoose.models.Address || mongoose.model("Address", AddressSchema);
export default Address;
