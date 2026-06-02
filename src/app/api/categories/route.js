import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("GET categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    }

    const category = await Category.create(body);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
