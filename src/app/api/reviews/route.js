import { NextResponse } from "next/server";
import { embedText } from "@/lib/ai";
import { getReviewsCollection } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { title, body, categories, author } = await req.json();

    if (!body || body.trim().length === 0) {
      return NextResponse.json(
        { error: "Review content is required." },
        { status: 400 }
      );
    }

    let categoryList = [];
    if (Array.isArray(categories)) {
      categoryList = [...new Set(
        categories
          .filter((c) => typeof c === "string" && c.trim().length > 0)
          .map((c) => c.trim().toLowerCase())
      )];
    } else if (typeof categories === "string" && categories.trim().length > 0) {
      categoryList = [categories.trim().toLowerCase()];
    }
    if (categoryList.length === 0) {
      categoryList = ["general"];
    }

    const textToEmbed = `${title || ""}\n${body}`.trim();
    const embedding = await embedText(textToEmbed);

    const reviews = await getReviewsCollection();

    const result = await reviews.insertOne({
      title: title || "",
      body,
      categories: categoryList,
      author: author || "Anonymous",
      embedding,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    });
  } catch (err) {
    console.error("Submit review error:", err);
    return NextResponse.json(
      { error: "Internal server error.", detail: err.message },
      { status: 500 }
    );
  }
}