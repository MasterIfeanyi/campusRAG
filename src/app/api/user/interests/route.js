// src/app/api/user/interests/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const VALID_INTERESTS = [
  "Life",
  "Drama",
  "Science",
  "Sports",
  "Tech",
  "Security",
  "Travel",
  "Blogging",
  "Health",
];

export async function PATCH(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "You must be logged in." }, { status: 401 });
  }

  const body = await req.json();
  const interests = body.interests;

  if (!Array.isArray(interests)) {
    return Response.json({ error: "Interests must be a list." }, { status: 400 });
  }

  const allValid = interests.every((tag) => VALID_INTERESTS.includes(tag));
  if (!allValid) {
    return Response.json({ error: "Invalid interest tag." }, { status: 400 });
  }

  await dbConnect();

  await User.findByIdAndUpdate(session.user.id, { interests });

  return Response.json({ success: true, interests });
}