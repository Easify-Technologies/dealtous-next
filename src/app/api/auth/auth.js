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
          role: user.role,
          accessToken
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
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};