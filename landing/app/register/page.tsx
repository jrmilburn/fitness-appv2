'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://fitness.joemilburn.xyz/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    phone,
                }),
            });

            if (!response.ok) {
                throw new Error("Registration failed. Please try again.");
            }

            router.push('/confirmation');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative h-screen w-full font-sans overflow-hidden">
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
                            <label htmlFor="phone" className="font-semibold block mb-1">
                                Phone Number<strong>*</strong>
                            </label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                pattern="(\d{2}[ ]?\d{4}[ ]?\d{4})"
                                className="border border-gray-300 rounded p-2 w-full"
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="phone" className="font-semibold block mb-1">
                                Email<strong>*</strong>
                            </label>
                            <input
                                type="email"
                                id="phone"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded transition hover:bg-blue-700 w-full"
                    >
                        Create Account
                    </button>
                    <p className='text-sm opacity-50'><em>We try to keep the data we collect from you to a minimum. We will only use your phone number for OTP veirification as JFIT uses passwordless authentication.</em></p>
                </form>
            </div>
        </div>
    );
}
