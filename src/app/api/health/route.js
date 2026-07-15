import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { embedText } from "@/lib/ai";

export async function GET() {
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

  return NextResponse.json(status, { status: healthy ? 200 : 503 });
}