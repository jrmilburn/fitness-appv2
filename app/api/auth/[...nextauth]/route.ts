// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "../../../lib/authOptions"; // Adjust the path if necessary

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };