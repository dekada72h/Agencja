import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPartner } from "@/lib/partners";

declare module "next-auth" {
  interface User {
    role?: "owner" | "partner";
  }
  interface Session {
    user: {
      email: string;
      name: string;
      role: "owner" | "partner";
    };
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  // Read AUTH_SECRET from env at runtime; required for JWT signing.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;
        const partner = await verifyPartner(email, password);
        if (!partner) return null;
        return {
          id: partner.email,
          email: partner.email,
          name: partner.name,
          role: partner.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: "owner" | "partner" }).role ?? "partner";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "owner" | "partner") ?? "partner";
      }
      return session;
    },
    authorized({ auth, request }) {
      // Only /panel/* requires auth (login lives at /login as a sibling
      // outside the /panel layout subtree, so it never hits this guard).
      if (request.nextUrl.pathname.startsWith("/panel")) return !!auth;
      return true;
    },
  },
});
