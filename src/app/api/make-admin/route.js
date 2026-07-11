import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required. Example: /api/make-admin?email=your@email.com" }, { status: 400 });
  }

  try {
    await connectDB();
    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: `User with email ${email} not found. Please log in or register first.` }, { status: 404 });
    }

    return NextResponse.json({
      message: `Success! User ${email} is now an admin.`,
      instructions: "Important: You must log out and log back in for the new admin permissions to take effect.",
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
