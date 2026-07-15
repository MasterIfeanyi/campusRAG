import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import AdminInvite from "@/models/AdminInvite";
import User from "@/models/User";

const INVITE_EXPIRY_HOURS = 48;

// Only an existing admin can generate a new invite code
export async function generateInviteCode(requestingUser) {
  await dbConnect();

  if (requestingUser.role !== "superadmin") {
    const err = new Error("Only the superadmin can generate admin invites.");
    err.name = "ForbiddenError";
    throw err;
  }

  const code = crypto.randomBytes(16).toString("hex");

  const invite = await AdminInvite.create({
    code,
    createdBy: requestingUser.id,
    expiresAt: new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000),
  });

  return { code: invite.code, expiresAt: invite.expiresAt };
}

// A logged-in user redeems a code to become an admin
export async function redeemInviteCode(code, userId) {
  await dbConnect();

  const invite = await AdminInvite.findOne({ code });

  if (!invite) {
    const err = new Error("Invalid invite code.");
    err.name = "ValidationError";
    throw err;
  }

  if (invite.usedBy) {
    const err = new Error("This invite code has already been used.");
    err.name = "ValidationError";
    throw err;
  }

  if (invite.expiresAt < new Date()) {
    const err = new Error("This invite code has expired.");
    err.name = "ValidationError";
    throw err;
  }

  invite.usedBy = userId;
  invite.usedAt = new Date();
  await invite.save();

  const user = await User.findByIdAndUpdate(userId, { role: "admin" }, { new: true });

  return { displayName: user.displayName, role: user.role };
}