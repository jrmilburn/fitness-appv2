"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import searchIcon from "../assets/search.svg";
import settingsIcon from "../assets/settings.svg";

export default function Navbar() {
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/workouts/current");

  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <div className="relative">
      {/* Top Bar for Small Screens */}
      <div className="fixed top-0 left-0 w-full h-16 bg-white flex items-center justify-between px-4 shadow-md md:hidden z-50">
        {/* App Logo */}
        <Link href="/workouts/current">
          <div className="flex items-center space-x-2 sm:hidden">
            <Image src="/logo.jpg" alt="App Logo" width={32} height={32} />
            <h2 className="font-bold text-lg relative">JFit <em className="absolute text-xs">Classic</em></h2>
          </div>
        </Link>

        {/* Hamburger Button */}
        <button
          className="flex flex-col items-center justify-center space-y-1 w-8 h-8 bg-white text-white rounded-md"
          onClick={toggleNav}
        >
          <span
            className={`block w-6 h-1 bg-black transform transition-transform duration-300 ${
              navOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-1 bg-black transition-opacity duration-300 ${
              navOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-1 bg-black transform transition-transform duration-300 ${
              navOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 h-full w-full bg-white md:w-64 shadow-lg transform transition-transform duration-300 z-40 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:fixed md:w-80`}
      >
        <ul className="flex flex-col justify-between p-8 h-screen max-h-[100%]">
          {/* Logo */}
          <Link href="/">
            <div className="w-full flex flex-col items-center hidden sm:flex ">
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
          <ul className="flex flex-col space-y-4">
            <p className="border-b-2">Training</p>
            <li
              className={`text-xl p-2 ${
                activeLink === "/workouts/current"
                  ? "bg-gray-200 rounded-lg"
                  : ""
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
                activeLink === "/create-program"
                  ? "bg-gray-200 rounded-lg"
                  : ""
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
            <li
              className={`text-xl p-2 ${
                activeLink === "/custom-excercises"
                  ? "bg-gray-200 rounded-lg"
                  : ""
              }`}
            >
              <Link
                href="/custom-excercises"
                onClick={() => {
                  setActiveLink("/custom-excercises");
                  setNavOpen(false);
                }}
              >
                Custom Excercises
              </Link>
            </li>
          </ul>

          <ul className="flex flex-col space-y-4">
            <p className="border-b-2">Coaching</p>
            <li
              className={`text-xl p-2 ${
                activeLink === "/coaching/clients"
                  ? "bg-gray-200 rounded-lg"
                  : ""
              }`}
            >
              <Link
                href="/coaching/clients"
                onClick={() => {
                  setActiveLink("/coaching/clients");
                  setNavOpen(false);
                }}
              >
                Clients
              </Link>
            </li>
          </ul>

          <ul className="flex flex-col space-y-4">
            <p className="border-b-2">User</p>
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
                src={session?.user?.image || "/avatar.svg"}
                width={32}
                height={32}
                className="rounded-full"
                alt="Profile"
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
                width={32}
                height={32}
                alt="Search Icon"
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
                width={32}
                height={32}
                alt="Settings Icon"
              />
            </li>
          </ul>

            <button
              className="bg-[#eee] text-xl rounded p-2 mt-4 w-full"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
        </ul>
      </nav>

    </div>
  );
}