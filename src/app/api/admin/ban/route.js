import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/requireAdmin";
import { banUser } from "@/services/systemService";

export async function POST(req) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const { userId } = await req.json();
    const result = await banUser(userId, session.user);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err.name === "ForbiddenError") {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err.name === "NotFoundError") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}