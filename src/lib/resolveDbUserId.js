import mongoose from "mongoose";
import User from "@/models/User";

export async function resolveDbUserId(session) {
  const sessionId = session?.user?.id;
  if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) return sessionId;
  if (!session?.user?.email) return null;

  const user = await User.findOne({ email: session.user.email }).select("_id").lean();
  return user?._id?.toString() || null;
}
