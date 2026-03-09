import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // ✅ Generate JWT token manually here
        const accessToken = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.NEXTAUTH_SECRET,
          { expiresIn: "7d" }
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          accessToken,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    redirect({ url, baseUrl }) {
      return url.startsWith("/") ? baseUrl + url : url;
    },
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      if (user?.id) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token?.accessToken) {
        session.user.accessToken = token.accessToken;
      }
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};