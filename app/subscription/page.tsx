// app/subscription/page.tsx

import { prisma } from '../lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { redirect } from 'next/navigation';
import PremiumDetails from '../components/Subscription/PremiumDetails'; // Adjust the import path as needed
import StandardUserDetails from '../components/Subscription/StandardUserDetails';

export default async function Subscription() {
    // Fetch the current session
    const session = await getServerSession(authOptions);

    // If no session exists, redirect to the sign-in page
    if (!session) {
        redirect('/api/auth/signin');
    }

    // Fetch the user from the database using Prisma
    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email,
        },
        include: {
            subscription: true,
        },
    });

    // If user is not found in the database, handle accordingly
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">User not found.</p>
            </div>
        );
    }

    // Destructure the user's role
    const { subscription } = user;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Subscription Details</h1>

            {subscription?.plan === 'PREMIUM' ? (
                <PremiumDetails user={user} />
            ) : (
                <StandardUserDetails />
            )}
        </div>
    );
}
