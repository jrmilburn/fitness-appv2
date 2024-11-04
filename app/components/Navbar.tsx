"use client";

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const { data: session } = useSession();

    const [signInForm, setSignInForm] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const defaultProfileImage = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png';
    const [auth, setAuth] = useState({
        isAuth: false,
        name: null,
        email: null,
        image: defaultProfileImage,
    });

    useEffect(() => {
        if (session?.user) {
            setIsAuth(true);
            setAuth({
                isAuth: true,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image || defaultProfileImage,
            });
        } else {
            setIsAuth(false);
            setAuth({
                isAuth: false,
                name: null,
                email: null,
                image: defaultProfileImage,
            });
        }
    }, [session]);
    
    const handleSignIn = () => {
        setSignInForm(true);
    };

    const formRef = useRef(null);

    const handleClickOutside = (event) => {
        // Check if the clicked element is outside the form
        if (formRef.current && !formRef.current.contains(event.target)) {
            setSignInForm(false); // Close the form
        }
    };

    useEffect(() => {
        if (signInForm) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [signInForm]);

    return (
        <nav className='h-full border-r bg-background shadow-lg min-w-80'>

            <ul className='flex flex-col justify-between p-8 h-screen max-h-[100%] items-left'>
                
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
                    <ul className='flex flex-col space-y-6'>
                    <p className='border-b-2 '>Training</p>
                    <li className='text-xl'><Link href={`/workouts/current`} className='nav-link'>Current Workout</Link></li>
                    <li className='text-xl'><Link href={`/create-program`} className='nav-link'>New Program</Link></li>
                    </ul>
                    <ul className='flex flex-col space-y-6'>
                        <p className='border-b-2'>User</p>
                        <li className='text-xl'><Link href={`/profile`} className='nav-link'>Profile</Link></li>
                        <li className='text-xl'><Link href={`/search`} className='nav-link'>Search</Link></li>
                        <li className='text-xl'><Link href={`/settings`} className='nav-link'>Settings</Link></li>
                        {auth.isAuth ? (
                            <button className='bg-[#eee] text-xl rounded p-2' onClick={() => signOut()}>Sign Out</button>
                        ) : (
                            <button className='bg-[#eee] text-xl rounded p-2' onClick={handleSignIn}>Sign In</button>
                        )}
                    </ul>
                    </>
                )}
            </ul>
        </nav>
    );
}