'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    phone,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error("Registration failed. Please try again.");
            }

            router.push('/landingpage/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="relative h-screen w-full font-sans">
            {/* Background Image */}
            <Image
                src="/auth-background.webp"
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0"
                priority
            />

            {/* Form Section */}
            <div className="flex flex-col justify-center items-center h-full w-full relative z-10 p-4 sm:p-8">
                <form className="w-full max-w-lg bg-white bg-opacity-90 p-6 sm:p-8 shadow-md flex flex-col space-y-6" onSubmit={handleRegister}>
                    <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="first-name" className="font-semibold block mb-1">
                                First Name <strong>*</strong>
                            </label>
                            <input
                                type="text"
                                id="first-name"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="last-name" className="font-semibold block mb-1">
                                Last Name <strong>*</strong>
                            </label>
                            <input
                                type="text"
                                id="last-name"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="email" className="font-semibold block mb-1">
                                Email <strong>*</strong>
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="phone" className="font-semibold block mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                pattern="(\d{2}[ ]?\d{4}[ ]?\d{4})"
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="font-semibold block mb-1">
                                Password <strong>*</strong>
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="font-semibold block mb-1">
                                Confirm Password <strong>*</strong>
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded transition hover:bg-blue-700 w-full"
                    >
                        Create Account
                    </button>
                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: "/workouts/current" })}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black border border-gray-300 font-semibold rounded-lg hover:bg-gray-100 transition duration-300 w-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="w-5 h-5"
                        >
                            <path fill="#EA4335" d="M24 9.5c3.2 0 5.8 1.1 7.8 3.1l5.8-5.8C33.8 3.5 29.2 1.5 24 1.5 14.8 1.5 7.2 7.8 4.5 16.2l6.9 5.4C13.2 15.2 18.2 9.5 24 9.5z" />
                            <path fill="#34A853" d="M46.5 24c0-1.6-.2-3.2-.5-4.7H24v9.4h12.7c-.5 2.5-1.9 4.6-3.9 6.1l6.1 4.7c3.6-3.3 5.6-8.1 5.6-13.5z" />
                            <path fill="#FBBC05" d="M10.5 28.2c-1-2.5-1-5.2 0-7.7l-6.9-5.4c-2.9 5.8-2.9 12.7 0 18.5l6.9-5.4z" />
                            <path fill="#4285F4" d="M24 46.5c5.2 0 9.8-1.7 13.1-4.7l-6.1-4.7c-1.7 1.1-3.8 1.8-6.1 1.8-5.8 0-10.8-3.7-12.6-8.9l-6.9 5.4C8.9 42.6 15.4 46.5 24 46.5z" />
                        </svg>
                        Continue with Google
                    </button>
                    <p className="text-center mt-4">
                        Already have an account?{' '}
                        <Link href="/landingpage/login" className="font-bold text-blue-600 hover:text-blue-800">
                            Log in
                        </Link>
                    </p>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
}
