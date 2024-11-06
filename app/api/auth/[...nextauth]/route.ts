
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '../../../lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials as { email: string; password: string };

                // Look up the user in the database
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                // Verify the password
                const isValidPassword = await bcrypt.compare(password, user.password || "");

                if (!isValidPassword) {
                    throw new Error("Incorrect password");
                }

                // Return the user object if login is successful
                return user;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Redirect to /workouts/current after successful login
            return `http://localhost:3000/workouts/current`;
        },
    },
    pages: {
        signIn: "/landingpage/login",
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET!,
    }
}

const handler = NextAuth(authOptions);

// Explicitly define GET and POST handlers for NextAuth
export { handler as GET, handler as POST };