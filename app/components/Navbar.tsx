"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Import Outline Icons
import {
  LightningBoltIcon as LightningBoltOutlineIcon,
  PlusCircleIcon as PlusCircleOutlineIcon,
  ClipboardListIcon as ClipboardListOutlineIcon,
  MoonIcon as MoonOutlineIcon
} from "@heroicons/react/outline";

// Import Solid Icons
import {
  LightningBoltIcon as LightningBoltSolidIcon,
  PlusCircleIcon as PlusCircleSolidIcon,
  ClipboardListIcon as ClipboardListSolidIcon,
  SunIcon as SunSolidIcon
} from "@heroicons/react/solid";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  // Toggle navigation for mobile
  const toggleNav = () => setNavOpen(!navOpen);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  const NavItem = ({ href, label, IconOutline, IconSolid }) => {
    const isActive = pathname === href;
    return (
      <li className={`text-xl p-2 ${isActive ? "bg-gray-300 rounded-lg" : ""}`}>
        <Link href={href} onClick={() => setNavOpen(false)} className="flex items-center space-x-2">
          {isActive ? (
            <IconSolid className="h-6 w-6" />
          ) : (
            <IconOutline className="h-6 w-6" />
          )}
          <span>{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="relative">
      {/* Top Bar for Mobile */}
      <div className="fixed top-0 left-0 w-full h-16 bg-gray-100 flex items-center justify-between px-4 shadow-md md:hidden z-50">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <h2 className="font-bold text-lg">MyApp</h2>
          </div>
        </Link>
        <button
          aria-label="Toggle Navigation Menu"
          onClick={toggleNav}
          className="w-8 h-8 flex flex-col justify-center items-center bg-gray-100 rounded-md z-50"
        >
          <span className={`block w-6 h-1 bg-gray-800 transform transition duration-300 ${navOpen ? "rotate-45 translate-y-1" : ""}`}></span>
          <span className={`block w-6 h-1 bg-gray-800 transition-opacity duration-300 ${navOpen ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`block w-6 h-1 bg-gray-800 transform transition duration-300 ${navOpen ? "-rotate-45 -translate-y-1" : ""}`}></span>
        </button>
      </div>

      {/* Sidebar Navbar for Desktop */}
      <nav
        className={`fixed top-0 left-0 h-full w-full bg-gray-100 shadow-lg transform transition-transform duration-300 z-40 md:w-64 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <ul className="flex flex-col justify-between p-8 h-full">
          <Link href="/">
            <div className="flex flex-col items-center mb-8">
              <Image src="/logo.png" alt="Logo" width={80} height={80} />
              <h2 className="font-bold text-3xl">MyApp</h2>
            </div>
          </Link>
          {/* Only the training links */}
          <ul className="flex flex-col space-y-2">
            <NavItem
              href="/workouts/current"
              label="Current Workout"
              IconOutline={LightningBoltOutlineIcon}
              IconSolid={LightningBoltSolidIcon}
            />
            <NavItem
              href="/create-program"
              label="New Program"
              IconOutline={PlusCircleOutlineIcon}
              IconSolid={PlusCircleSolidIcon}
            />
            <NavItem
              href="/programs"
              label="Programs"
              IconOutline={ClipboardListOutlineIcon}
              IconSolid={ClipboardListSolidIcon}
            />
          </ul>
          <ul className="flex flex-col space-y-2 mt-4">
            <li>
              <button
                onClick={() => {
                  toggleDarkMode();
                  setNavOpen(false);
                }}
                className="flex items-center space-x-2 p-2"
              >
                {isDarkMode ? (
                  <>
                    <SunSolidIcon className="h-6 w-6" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <MoonOutlineIcon className="h-6 w-6" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white p-2 rounded"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </ul>
      </nav>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 w-full h-16 bg-gray-100 flex justify-around items-center px-4 shadow-md md:hidden z-30">
        <NavItem
          href="/workouts/current"
          label="Workout"
          IconOutline={LightningBoltOutlineIcon}
          IconSolid={LightningBoltSolidIcon}
        />
        <NavItem
          href="/create-program"
          label="New Program"
          IconOutline={PlusCircleOutlineIcon}
          IconSolid={PlusCircleSolidIcon}
        />
        <NavItem
          href="/programs"
          label="Programs"
          IconOutline={ClipboardListOutlineIcon}
          IconSolid={ClipboardListSolidIcon}
        />
        <button onClick={toggleDarkMode} className="p-2">
          {isDarkMode ? (
            <SunSolidIcon className="h-6 w-6" />
          ) : (
            <MoonOutlineIcon className="h-6 w-6" />
          )}
        </button>
        <button onClick={() => signOut()} className="bg-red-500 text-white p-2 rounded">
          Sign Out
        </button>
      </div>
    </div>
  );
}
