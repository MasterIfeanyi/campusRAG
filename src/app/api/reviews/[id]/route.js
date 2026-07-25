import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getReviewById, updateReview, deleteReview } from "@/services/reviewService";

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

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { title, body, categories } = await req.json();

    if (!body || typeof body !== "string" || body.trim().length === 0) {
      return NextResponse.json(
        { error: "Review content is required." },
        { status: 400 }
      );
    }

    const updated = await updateReview({
      reviewId: id,
      userId: session.user.id,
      title,
      body,
      categories,
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (err) {
    console.error("Update review error:", err);

    if (err.name === "NotFoundError") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err.name === "ForbiddenError") {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation failed.", detail: err.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const { id } = await params;

    await deleteReview({
      reviewId: id,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete review error:", err);

    if (err.name === "NotFoundError") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err.name === "ForbiddenError") {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }

    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}