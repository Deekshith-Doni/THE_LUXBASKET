import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { resolveDbUserId } from "@/lib/resolveDbUserId";

const promotionSchema = z.object({
  email: z.string().trim().email().max(254),
});

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const actorId = await resolveDbUserId(session);
    const actor = actorId ? await User.findById(actorId).select("role") : null;
    if (actor?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validation = promotionSchema.safeParse(await req.json());
    if (!validation.success) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    const email = validation.data.email.toLowerCase();
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Administrator access granted.",
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Admin promotion error:", error);
    return NextResponse.json({ error: "Could not update administrator access" }, { status: 500 });
  }
}
