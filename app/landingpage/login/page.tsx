'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (!result.ok) {
            setError("Invalid email or password");
        } else {
            router.push("/workouts/current"); // Redirect to a protected page after login
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-100 w-full">
        <Image
          src="/auth-background.webp" // Optimized WebP format for faster loading
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          priority // Ensures Next.js prioritizes this image
          placeholder="blur" // Adds a blur placeholder while loading
          blurDataURL="data:image/webp;base64,[your-base64-encoded-dark-placeholder]" // Use a dark base64 placeholder for the initial load
        />
            <div className="relative z-10 bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col space-y-4">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-semibold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    onClick={handleSubmit}
                >
                    Login
                </button>

                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: "/workouts/current" })}
                    className="flex mx-auto items-center justify-center gap-2 px-6 py-3 w-full bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-300"
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
                    Don&apos;t have an account? <Link href="/landingpage/register" className="font-bold text-blue-500 hover:text-blue-700">Register</Link>
                </p>
            </div>
        </div>
    );
}