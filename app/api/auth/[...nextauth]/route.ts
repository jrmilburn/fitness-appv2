import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from '../../../lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET!,
    }
}

const handler = NextAuth(authOptions);

// Explicitly define GET and POST handlers for NextAuth
export { handler as GET, handler as POST };