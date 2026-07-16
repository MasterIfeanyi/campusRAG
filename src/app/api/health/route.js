import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { embedText } from "@/lib/ai";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {

  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const status = {
    database: { status: "unknown", message: "" },
    ai: { status: "unknown", message: "" },
    timestamp: new Date().toISOString(),
  };

  try {
    await dbConnect();
    status.database = { status: "ok", message: "Connected successfully." };
  } catch (err) {
    status.database = { status: "error", message: err.message };
  }

  try {
    await embedText("health check");
    status.ai = { status: "ok", message: "Embedding service responded successfully." };
  } catch (err) {
    status.ai = { status: "error", message: err.message };
  }

  const healthy = status.database.status === "ok" && status.ai.status === "ok";

  // A single, dashboard-ready summary — this is what determines your green/red dot
  let summary;
  if (healthy) {
    summary = "All systems operational.";
  } else {
    const brokenParts = [];
    if (status.database.status === "error") brokenParts.push("database");
    if (status.ai.status === "error") brokenParts.push("AI service");
    summary = `Issue detected with: ${brokenParts.join(" and ")}.`;
  }

  return NextResponse.json(
    {
      healthy,
      summary,
      ...status,
    },
    { status: healthy ? 200 : 503 }
  );
}