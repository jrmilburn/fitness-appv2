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
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/auth/register`, {
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
        <div className="flex h-screen w-full font-sans bg-gray-100">
            <Image
                src="/auth-background.png"
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0"
            />


            {/* Right Content Section */}
            <div className="flex flex-col justify-center items-center flex-grow p-8 space-y-8 relative z-1">

                <form className="w-full max-w-lg mx-auto" onSubmit={handleRegister}>
                    <div className="bg-white p-8 shadow-md flex flex-col space-y-4">
                        <h1 className="text-2xl mb-6 font-bold">Register</h1>
                        <div className="flex gap-8">
                            {/* Left Form Fields */}
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex flex-col">
                                    <label htmlFor="first-name" className="font-semibold">
                                        First name <strong>*</strong>
                                    </label>
                                    <input
                                        type="text"
                                        id="first-name"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="mail" className="font-semibold">
                                        Email <strong>*</strong>
                                    </label>
                                    <input
                                        type="email"
                                        id="mail"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="password" className="font-semibold">
                                        Password <strong>*</strong>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border border-gray-300 rounded p-2"
                                    />
                                </div>
                            </div>

                            {/* Right Form Fields */}
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex flex-col">
                                    <label htmlFor="last-name" className="font-semibold">
                                        Last name <strong>*</strong>
                                    </label>
                                    <input
                                        type="text"
                                        id="last-name"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="phone-number" className="font-semibold">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        id="phone-number"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        pattern="(\d{2}[ ]?\d{4}[ ]?\d{4})"
                                        className="border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="confirm-password" className="font-semibold">
                                        Confirm Password <strong>*</strong>
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="border border-gray-300 rounded p-2"
                                    />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-3 px-6 rounded mt-6 transition hover:bg-gray-100 hover:text-green-700 border border-green-700 mx-8">
                            Create Account
                        </button>
                        <button
                            type="button"
                            onClick={() => signIn('google')}
                            className="flex mx-8 items-center justify-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="w-5 h-5"
                            >
                                <path fill="#4285F4" d="M24 9.5c3.2 0 5.8 1.1 7.8 3.1l5.8-5.8C33.8 3.5 29.2 1.5 24 1.5 14.8 1.5 7.2 7.8 4.5 16.2l6.9 5.4C13.2 15.2 18.2 9.5 24 9.5z" />
                                <path fill="#34A853" d="M46.5 24c0-1.6-.2-3.2-.5-4.7H24v9.4h12.7c-.5 2.5-1.9 4.6-3.9 6.1l6.1 4.7c3.6-3.3 5.6-8.1 5.6-13.5z" />
                                <path fill="#FBBC05" d="M10.5 28.2c-1-2.5-1-5.2 0-7.7l-6.9-5.4c-2.9 5.8-2.9 12.7 0 18.5l6.9-5.4z" />
                                <path fill="#EA4335" d="M24 46.5c5.2 0 9.8-1.7 13.1-4.7l-6.1-4.7c-1.7 1.1-3.8 1.8-6.1 1.8-5.8 0-10.8-3.7-12.6-8.9l-6.9 5.4c3.2 6.3 9.7 10.9 17.6 10.9z" />
                            </svg>
                            Sign in with Google
                        </button>
                        <p className="text-center">
                            Already have an account? <Link href="/landingpage/login" className="font-bold text-blue-500 hover:text-blue-700">Log in</Link>
                        </p>
                    </div>
                    {error && <p className="text-red-500 mt-4">{error}</p>}

                </form>
            </div>
        </div>
    );
}