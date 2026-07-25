import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getReviewsByUser } from "@/services/reviewService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const reviews = await getReviewsByUser(session.user.id);
    return NextResponse.json({ success: true, reviews });
  } catch (err) {
    console.error("Fetch user reviews error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
