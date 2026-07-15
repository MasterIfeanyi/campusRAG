import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Returns the session if the user is a logged-in admin,
// otherwise returns null. Routes decide what to do with that.
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  // not authenticated at all
  if (!session?.user?.id) return null;
  // authenticated, but not authorized
  if (session.user.role !== "admin" && session.user.role !== "superadmin") return null;
  return session;
}


// Stricter check — only the superadmin passes this
export async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  if (session.user.role !== "superadmin") return null;
  return session;
}