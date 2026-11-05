import { createHash } from "crypto";
import ApiRateLimit from "@/models/ApiRateLimit";

export async function checkSubmissionRateLimit(request, scope, { limit, windowMs }) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || forwarded;

  // Proxies normally set one of these headers. If none is available, avoid applying a shared global limit.
  if (!ip) return { limited: false };

  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const key = createHash("sha256").update(`${scope}:${ip}:${window}`).digest("hex");
  const expiresAt = new Date((window + 1) * windowMs + 60_000);
  let record;
  try {
    record = await ApiRateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
  } catch (error) {
    // Concurrent first requests can race to insert the same window key.
    if (error?.code !== 11000) throw error;
    record = await ApiRateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      { new: true },
    ).lean();
  }

  return {
    limited: record.count > limit,
    retryAfterSeconds: Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)),
  };
}
