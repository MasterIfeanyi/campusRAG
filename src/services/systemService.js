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

  const user = await User.findById(userId);
  if (user.role === "superadmin") {
    const err = new Error("Superadmin already has full access.");
    err.name = "ValidationError";
    throw err;
  }

  invite.usedBy = userId;
  invite.usedAt = new Date();
  await invite.save();

  user.role = "admin";
  await user.save();

  return { displayName: user.displayName, role: user.role };
}


export async function banUser(targetUserId, requestingUser) {
  await dbConnect();

  if (requestingUser.role !== "superadmin") {
    const err = new Error("Only the superadmin can ban users.");
    err.name = "ForbiddenError";
    throw err;
  }

  if (targetUserId === requestingUser.id) {
    const err = new Error("You cannot ban yourself.");
    err.name = "ForbiddenError";
    throw err;
  }

  const target = await User.findById(targetUserId);
  if (!target) {
    const err = new Error("User not found.");
    err.name = "NotFoundError";
    throw err;
  }

  target.status = "banned";
  await target.save();

  return { displayName: target.displayName, status: target.status };
}

export async function unbanUser(targetUserId, requestingUser) {
  await dbConnect();

  if (requestingUser.role !== "superadmin") {
    const err = new Error("Only the superadmin can unban users.");
    err.name = "ForbiddenError";
    throw err;
  }

  const target = await User.findByIdAndUpdate(
    targetUserId,
    { status: "active" },
    { new: true }
  );

  if (!target) {
    const err = new Error("User not found.");
    err.name = "NotFoundError";
    throw err;
  }

  return { displayName: target.displayName, status: target.status };
}