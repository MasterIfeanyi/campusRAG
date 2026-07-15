import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redeemInviteCode } from "@/services/systemService";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  try {
    const { code } = await req.json();
    const result = await redeemInviteCode(code, session.user.id);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    if (err.name === "ValidationError") {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}