"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import searchIcon from "../assets/search.svg";
import settingsIcon from "../assets/settings.svg";

export default function Navbar() {
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/workouts/current");

  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <div>
      {/* Hamburger Button */}
      <button
        className="fixed top-4 right-4 z-50 flex flex-col items-center justify-center space-y-1 w-10 h-10 bg-gray-800 text-white rounded-md md:hidden"
        onClick={toggleNav}
      >
        <span
          className={`block w-6 h-1 bg-white transform transition-transform duration-300 ${
            navOpen ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-1 bg-white transition-opacity duration-300 ${
            navOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-1 bg-white transform transition-transform duration-300 ${
            navOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg transform transition-transform duration-300 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-80`}
      >
        <ul className="flex flex-col justify-between p-8 h-screen max-h-[100%]">
          {/* Logo */}
          <Link href="/" className="hover:pointer">
            <div className="w-full flex flex-col items-center">
              <Image
                src="/logo.jpg"
                alt="App logo"
                width={80}
                height={80}
                className="mx-auto"
              />
              <h2 className="font-bold text-3xl">JFit</h2>
            </div>
          </Link>

          {/* Navigation Links */}
          <ul className="flex flex-col space-y-4 flex-grow">
            <li
              className={`text-xl p-2 ${
                activeLink === "/workouts/current" ? "bg-gray-200 rounded-lg" : ""
              }`}
            >
              <Link
                href="/workouts/current"
                onClick={() => {
                  setActiveLink("/workouts/current");
                  setNavOpen(false);
                }}
              >
                Current Workout
              </Link>
            </li>
            <li
              className={`text-xl p-2 ${
                activeLink === "/create-program" ? "bg-gray-200 rounded-lg" : ""
              }`}
            >
              <Link
                href="/create-program"
                onClick={() => {
                  setActiveLink("/create-program");
                  setNavOpen(false);
                }}
              >
                New Program
              </Link>
            </li>
            <li
              className={`text-xl p-2 ${
                activeLink === "/programs" ? "bg-gray-200 rounded-lg" : ""
              }`}
            >
              <Link
                href="/programs"
                onClick={() => {
                  setActiveLink("/programs");
                  setNavOpen(false);
                }}
              >
                Programs
              </Link>
            </li>
          </ul>

          {/* User Section */}
          {session ? (
            <div>
              <ul className="flex flex-col space-y-4">
                <li
                  className={`text-xl p-2 flex justify-between items-center ${
                    activeLink === "/profile" ? "bg-gray-200 rounded-lg" : ""
                  }`}
                >
                  <Link
                    href="/profile"
                    onClick={() => {
                      setActiveLink("/profile");
                      setNavOpen(false);
                    }}
                  >
                    Profile
                  </Link>
                  <Image
                    src={session.user.image || "/avatar.svg"}
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt="Profile"
                  />
                </li>
                <li
                  className={`text-xl p-2 flex justify-between items-center ${
                    activeLink === "/settings" ? "bg-gray-200 rounded-lg" : ""
                  }`}
                >
                  <Link
                    href="/settings"
                    onClick={() => {
                      setActiveLink("/settings");
                      setNavOpen(false);
                    }}
                  >
                    Settings
                  </Link>
                  <Image
                    src={settingsIcon}
                    width={24}
                    height={24}
                    alt="Settings Icon"
                  />
                </li>
                <li
                  className={`text-xl p-2 flex justify-between items-center ${
                    activeLink === "/search" ? "bg-gray-200 rounded-lg" : ""
                  }`}
                >
                  <Link
                    href="/search"
                    onClick={() => {
                      setActiveLink("/search");
                      setNavOpen(false);
                    }}
                  >
                    Search
                  </Link>
                  <Image
                    src={searchIcon}
                    width={24}
                    height={24}
                    alt="Search Icon"
                  />
                </li>
              </ul>
              <button
                className="bg-[#eee] text-xl rounded p-2 mt-4 w-full"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="w-full px-6 py-3 bg-foreground text-white font-semibold rounded-lg shadow-md hover:opacity-75 transition"
              onClick={() => signIn()}
            >
              Login
            </button>
          )}
        </ul>
      </nav>

      {/* Overlay for Small Screens */}
      {navOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleNav}
        ></div>
      )}
    </div>
  );
}
