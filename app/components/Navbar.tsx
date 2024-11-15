"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import searchIcon from '../assets/search.svg';
import settingsIcon from '../assets/settings.svg';

export default function Navbar() {
  const { data: session } = useSession();

  const [signInForm, setSignInForm] = useState(false);

  const [auth, setAuth] = useState({
    isAuth: false,
    name: null,
    email: null,
    image: null,
  });

  // Set "Current Workout" as the default selected link
  const [activeLink, setActiveLink] = useState("/workouts/current");

  useEffect(() => {
    if (session?.user) {
      setAuth({
        isAuth: true,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    } else {
      setAuth({
        isAuth: false,
        name: null,
        email: null,
        image: null,
      });
    }
  }, [session]);

  const handleSignIn = () => {
    setSignInForm(true);
  };

  const formRef = useRef(null);

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setSignInForm(false);
    }
  };

  useEffect(() => {
    if (signInForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [signInForm]);

  return (
    <nav className="h-full border-r bg-background shadow-lg min-w-80">
      <ul className="flex flex-col justify-between p-8 h-screen max-h-[100%] items-left">
        {/* Logo */}
        <Link href='/' className="hover:pointer">
          <div className="w-full flex flex-col items-center">
            <Image src="/logo.jpg" alt="App logo" width={80} height={80} className="mx-auto" />
            <h2 className="font-bold text-3xl">JFit</h2>
          </div>
        </Link>

        {/* Logged Out State */}
        {!session ? (
          <li>
            <button
              className="w-full px-6 py-3 bg-foreground text-white font-semibold rounded-lg shadow-md hover:opacity-75 transition"
              onClick={handleSignIn}
            >
              Login
            </button>
          </li>
        ) : (
          <>
            {/* Navigation Links */}
            <ul className="flex flex-col space-y-4 flex-grow-2">
              <p className="border-b-2 ">Training</p>
              <li
                className={`text-xl p-2 ${
                  activeLink === "/workouts/current"
                    ? "bg-gray-200 rounded-lg"
                    : ""
                }`}
              >
                <Link
                  href="/workouts/current"
                  className="nav-link"
                  onClick={() => setActiveLink("/workouts/current")}
                >
                  Current Workout
                </Link>
              </li>
              <li
                className={`text-xl p-2 ${
                  activeLink === "/create-program"
                    ? "bg-gray-200 rounded-lg"
                    : ""
                }`}
              >
                <Link
                  href="/create-program"
                  className="nav-link"
                  onClick={() => setActiveLink("/create-program")}
                >
                  New Program
                </Link>
              </li>
              <li
                className={`text-xl p-2 ${
                  activeLink === "/programs"
                    ? "bg-gray-200 rounded-lg"
                    : ""
                }`}
              >
                <Link
                  href="/programs"
                  className="nav-link"
                  onClick={() => setActiveLink("/programs")}
                >
                  Programs
                </Link>
              </li>
            </ul>

            <ul className="flex flex-col space-y-4 flex-grow-2">
              <p className="border-b-2 ">Coaching</p>
              <li
                className={`text-xl p-2 ${
                  activeLink === "/coaching/clients"
                    ? "bg-gray-200 rounded-lg"
                    : ""
                }`}
              >
                <Link
                  href="/coaching/clients"
                  className="nav-link"
                  onClick={() => setActiveLink("/coaching/clients")}
                >
                  Clients
                </Link>
              </li>
            </ul>

            <ul className="flex flex-col space-y-4 flex-grow-2">
              <p className="border-b-2">User</p>
              <li
                className={`text-xl p-2 flex justify-between items-center ${
                  activeLink === "/profile" ? "bg-gray-200 rounded-lg" : ""
                }`}
              >
                <Link
                  href="/profile"
                  className="nav-link"
                  onClick={() => setActiveLink("/profile")}
                >
                  Profile
                </Link>
                <Image src={auth?.image || '/avatar.svg'} width={32} height={32} className='rounded-full' alt="profile"/>
              </li>
              <li
                className={`text-xl p-2 flex justify-between items-center ${
                  activeLink === "/search" ? "bg-gray-200 rounded-lg" : ""
                }`}
              >
                <Link
                  href="/search"
                  className="nav-link"
                  onClick={() => setActiveLink("/search")}
                >
                  Search
                </Link>
                <Image src={searchIcon} width={32} height={32} className='rounded-full' alt="profile"/>
              </li>
              <li
                className={`text-xl p-2 flex justify-between items-center ${
                  activeLink === "/settings" ? "bg-gray-200 rounded-lg" : ""
                }`}
              >
                <Link
                  href="/settings"
                  className="nav-link"
                  onClick={() => setActiveLink("/settings")}
                >
                  Settings
                </Link>
                <Image src={settingsIcon} width={32} height={32} className='rounded-full' alt="profile"/>
              </li>
            </ul>
            {auth.isAuth ? (
              <button
                className="bg-[#eee] text-xl rounded p-2"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="bg-[#eee] text-xl rounded p-2"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            )}
          </>
        )}
        {signInForm && (
          <>
            <div
              className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-200 p-8 px-16 z-50 bg-white flex flex-col gap-4"
              ref={formRef}
            >
              <form className="flex flex-col gap-4">
                <h3 className="text-2xl font-semibold">Sign In</h3>
                <input
                  type="text"
                  placeholder="email"
                  className="p-4 rounded-lg border-2 border-gray-200 text-lg"
                />
                <input
                  type="password"
                  placeholder="password"
                  className="p-4 rounded-lg border-2 border-gray-200 text-lg"
                />
                <button
                  onClick={handleSignIn}
                  className="p-4 border border-gray-200 text-lg"
                >
                  Sign In
                </button>
              </form>
              <div className="w-4/5 mx-auto border-b-2 border-gray-200 my-4"></div>
              <button
                onClick={() => signIn("google")}
                className="p-4 border border-gray-200 text-lg"
              >
                Sign in with Google
              </button>
            </div>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              onClick={() => setSignInForm(false)}
            ></div>
          </>
        )}
      </ul>
    </nav>
  );
}