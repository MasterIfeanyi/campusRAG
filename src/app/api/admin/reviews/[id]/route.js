import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { removeReview, dismissFlags } from "@/services/adminService";

// Remove a flagged review
export async function DELETE(req, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    await removeReview(params.id);
    return NextResponse.json({ success: true, status: "removed" });
  } catch (err) {
    if (err.name === "NotFoundError") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// Dismiss flags on a review (false alarm, restore to visible)
export async function PATCH(req, { params }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    await dismissFlags(params.id);
    return NextResponse.json({ success: true, status: "visible" });
  } catch (err) {
    if (err.name === "NotFoundError") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}