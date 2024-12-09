import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { verifyOtp } from "./twilio/SendSms";

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        CredentialsProvider({
            name: "OTP Login",
            credentials: {
                email: { label: "Email", type: "text" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                const { email, otp } = credentials as {
                    email: string;
                    otp: string;
                };

                // Check if the user exists
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                // Verify the OTP using your Twilio helper function
                const isValidOtp = await verifyOtp(user.email, otp);

                if (!isValidOtp) {
                    throw new Error("Invalid or expired OTP");
                }

                // Return user object for NextAuth
                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const userFromDb = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true },
                });
                token.id = user.id;
                token.role = userFromDb?.role || "user";
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            return session;
        },
    },
    pages: {
        signIn: "/login", // Update your sign-in page route if necessary
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET!,
    },
};