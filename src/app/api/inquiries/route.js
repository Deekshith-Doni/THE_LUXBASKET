import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { z } from "zod";
import { sendAdminNotification } from "@/lib/email";
import { checkSubmissionRateLimit } from "@/lib/rateLimit";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().regex(/^\+?[\d ()-]{10,18}$/),
  company: z.string().trim().max(120).optional(),
  type: z.enum(["corporate", "wedding", "bulk", "custom", "general"]),
  eventDate: z.string().max(40).optional(),
  quantity: z.number().int().min(1).max(100000).optional(),
  budget: z.string().max(100).optional(),
  message: z.string().trim().min(10).max(3000),
});

export async function POST(req) {
  try {
    const body = await req.json();
    if (body && typeof body === "object" && typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ error: "Unable to submit this request" }, { status: 400 });
    }
    const validation = inquirySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 },
      );
    }

    await connectDB();
    const rateLimit = await checkSubmissionRateLimit(req, "inquiries", { limit: 5, windowMs: 10 * 60 * 1000 });
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: "Too many messages were sent. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }
    const inquiry = await Inquiry.create(validation.data);

    // Send email notification (non-blocking)
    sendAdminNotification(inquiry).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully",
        id: inquiry._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 },
    );
  }
}
