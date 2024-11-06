'use client';

import Image from 'next/image';
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
            const response = await fetch('http://localhost:3000/api/auth/register', {
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
            {/* Left Image Section */}
            <div className="relative w-[clamp(600px,40%,1000px)] font-norse text-gray-100">
                <Image
                    src="/mediamodifier_image.png"
                    alt="jfit background"
                    layout="fill"
                    objectFit="cover"
                />
                <div className="absolute top-1/3 w-full flex items-center justify-center bg-black bg-opacity-50 z-10 gap-4 p-4">
                    <h2 className="text-7xl">JFIT</h2>
                </div>
            </div>

            {/* Right Content Section */}
            <div className="flex flex-col justify-center items-center flex-grow p-8 space-y-8">
                <h1 className="text-2xl max-w-[50ch] leading-snug">
                    Use your Google account or <br />
                    Sign up <em>now</em> to get started.
                </h1>

                <form className="w-full max-w-lg mx-auto" onSubmit={handleRegister}>
                    <div className="bg-white p-8 shadow-md flex flex-col space-y-4">
                        <h1 className="text-3xl mb-4">JFIT</h1>
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
                                        placeholder="First Name"
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
                                        placeholder="joe@example.com"
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
                                        placeholder="Last Name"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="phone-number" className="font-semibold">
                                        Phone Number <strong>*</strong>
                                    </label>
                                    <input
                                        type="text"
                                        id="phone-number"
                                        placeholder="0437 123 987"
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
                        <button type="submit" className="bg-green-700 text-white font-bold py-3 px-6 rounded mt-6 transition hover:bg-gray-100 hover:text-green-700 border border-green-700 mx-8">
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
                    </div>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>
                <p className="mx-8">
                    Already have an account? <a href="#" className="font-bold text-green-700 hover:text-green-900">Log in</a>
                </p>
            </div>
        </div>
    );
}