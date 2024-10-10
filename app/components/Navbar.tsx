"use client";

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className='h-full border-r bg-background shadow-lg min-w-80'>
            <ul className='flex flex-col justify-between p-8 h-screen max-h-[100%] items-center'>
                
                {/* Logo */}
                <h2 className='text-4xl font-semibold text-gray-800 mb-12'>JFit</h2>

                {/* Logged Out State */}
                {!session ? (
                    <li>
                        <button
                            className='w-full px-6 py-3 bg-foreground text-white font-semibold rounded-lg shadow-md hover:opacity-75 transition'
                            onClick={() => signIn()}
                        >
                            Login
                        </button>
                    </li>
                ) : (
                    <>
                        {/* Navigation Links */}
                        <div className='space-y-6'>
                            <li>
                                <Link href='/workouts/week'>
                                    <button className='w-full px-6 py-3 bg-foreground text-white font-semibold rounded-lg hover:opacity-75 transition'>
                                        Current Workout
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <Link href='/workouts'>
                                    <button className='w-full px-6 py-3 bg-foreground text-white font-semibold rounded-lg hover:opacity-75 transition'>
                                        View Current Week
                                    </button>
                                </Link>
                            </li>
                        </div>

                        <div className='space-y-6 mt-12'>
                            <li>
                                <Link href='/programs'>
                                    <button className='w-full px-6 py-3 bg-foreground text-white font-semibold rounded-lg hover:opacity-75 transition'>
                                        Programs
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <Link href='/create-program'>
                                    <button className='w-full px-6 py-3 bg-foreground text-white font-semibold rounded-lg hover:opacity-75 transition'>
                                        Create a Program
                                    </button>
                                </Link>
                            </li>
                        </div>

                        <div className='mt-12 space-y-4'>
                            <li>
                                <Link href='/profile'>
                                    <button className='w-full px-6 py-3 bg-foreground text-white font-semibold rounded-lg hover:opacity-75 transition'>
                                        Profile
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <button
                                    className='w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition'
                                    onClick={() => signOut()}
                                >
                                    Logout
                                </button>
                            </li>
                        </div>
                    </>
                )}
            </ul>
        </nav>
    );
}