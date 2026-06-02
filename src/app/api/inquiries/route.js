import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  type: z.enum(["corporate", "wedding", "bulk", "custom", "general"]),
  eventDate: z.string().optional(),
  quantity: z.number().optional(),
  budget: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validation = inquirySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 },
      );
    }

    await connectDB();
    const inquiry = await Inquiry.create(validation.data);

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
