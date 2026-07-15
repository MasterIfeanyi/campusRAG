import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                const user = await User.findOne({ email: credentials.email.toLowerCase() });
                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                if (user.status === "banned") {
                    return null; // NextAuth treats this the same as invalid credentials
                }

                return {
                    id: user._id.toString(),
                    displayName: user.displayName,
                    role: user.role,
                };
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        // build the token first
        async jwt({ token, user }) {
            // they just logged in
            if (user) {
                token.id = user.id;
                token.displayName = user.displayName;
                token.role = user.role;
            }
            // they are already logged in -  they're just navigating around
            return token;
        },
        // build the session from that token - The session gets sent to the browser so your frontend code can know who's logged in and what they're allowed to see
        async session({ session, token }) {
            const REVALIDATE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
            const now = Date.now();
            const shouldRevalidate = now - (token.lastChecked || 0) > REVALIDATE_INTERVAL_MS;

            if (shouldRevalidate) {
                await dbConnect();
                const currentUser = await User.findById(token.id);

                if (!currentUser || currentUser.status === "banned") {
                    return null; // session killed, at most REVALIDATE_INTERVAL_MS after the ban
                }

                // Refresh cached values and reset the check timer
                token.role = currentUser.role;
                token.displayName = currentUser.displayName;
                token.lastChecked = now;
            }

            // store the details of the token in the session.
            session.user.id = token.id;
            session.user.displayName = token.displayName;
            session.user.role = token.role;
            delete session.user.email; // never leak email into the client session
            delete session.user.name;
            delete session.user.image;

            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };