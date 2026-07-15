import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { generateUniqueAnonymousName } from "@/helpers/generateAnonymousName";
import { sanitizeText } from "@/helpers/fn";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "A valid email and a password (min 6 characters) are required." },
        { status: 400 }
      );
    }

    const cleanEmail = sanitizeText(email).toLowerCase();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: cleanEmail,
      password: hashedPassword,
      displayName: await generateUniqueAnonymousName(User),
    });

    return NextResponse.json(
      { success: true, displayName: user.displayName },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    if (err.name === "ValidationError") {
      return NextResponse.json({ error: "Validation failed.", detail: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}