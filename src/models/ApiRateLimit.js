import mongoose, { Schema } from "mongoose";

const ApiRateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, expires: 0 },
});

const ApiRateLimit = mongoose.models.ApiRateLimit || mongoose.model("ApiRateLimit", ApiRateLimitSchema);
export default ApiRateLimit;
