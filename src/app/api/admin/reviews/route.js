import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getFlaggedReviews } from "@/services/adminService";

export async function GET() {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const reviews = await getFlaggedReviews();
  return NextResponse.json({ success: true, reviews });
}