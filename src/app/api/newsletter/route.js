import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { auth } from "@/lib/auth";
import { checkSubmissionRateLimit } from "@/lib/rateLimit";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, subscribers });
  } catch (error) {
    console.error("GET newsletter subscribers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { email, website } = await req.json();

    if (typeof website === "string" && website.trim()) {
      return NextResponse.json({ error: "Unable to process this request" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    // Basic email pattern validation
    const normalizedEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (normalizedEmail.length > 254 || !emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    await connectDB();
    const rateLimit = await checkSubmissionRateLimit(req, "newsletter", { limit: 3, windowMs: 15 * 60 * 1000 });
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: "Too many subscription attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }

    // Check for existing subscription
    const existingSubscriber = await Subscriber.findOne({ email: normalizedEmail });
    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email is already subscribed" },
        { status: 400 }
      );
    }

    // Create the subscriber in the database
    const newSubscriber = await Subscriber.create({ email: normalizedEmail });

    return NextResponse.json(
      { success: true, subscriber: newSubscriber },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
