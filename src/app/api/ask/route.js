import { NextResponse } from "next/server";
import { askQuestion } from "@/services/askService";
import { askQuestionLimiter } from "@/helpers/rateLimiter";

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { allowed, remaining } = askQuestionLimiter(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 }
      );
    }

    const { question } = await req.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const result = await askQuestion(question);

    return NextResponse.json({
      success: true,
      ...result,
      remainingRequests: remaining,
    });
  } catch (err) {
    console.error("Ask question error:", err);

    if (err.name === "ValidationError") {
      return NextResponse.json(
        { error: err.message || "Validation failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}