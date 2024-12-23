'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SignUp() {

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
                <div className="w-full max-w-lg bg-white bg-opacity-90 p-6 sm:p-8 shadow-md flex flex-col space-y-6">
                    <h2 className='text-2xl inter-bold'>Please check your email</h2>
                    <div className='w-full flex justify-between'>
                        <button className=''>Send again</button>
                        <Link href='/'>
                        <button className=''>Home Page</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
