import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/requireAdmin";
import { generateInviteCode } from "@/services/systemService";

export async function POST() {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden. Only the superadmin can invite new admins." }, { status: 403 });
  }

  const invite = await generateInviteCode(session.user);
  return NextResponse.json({ success: true, ...invite });
}