import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/admin") && role !== "admin" && role !== "superadmin") {
      return Response.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/superadmin") && role !== "superadmin") {
      return Response.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // just needs to be logged in to reach the middleware check above
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/superadmin/:path*", "/reviews/new","/onboarding/interests"],
};