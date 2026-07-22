import { NextResponse } from "next/server";
import { getReviewById } from "@/services/reviewService";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const review = await getReviewById(id);
    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("Get review error:", err);

    if (err.name === "NotFoundError") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}