"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Import usePathname

// Import Outline Icons
import {
  LightningBoltIcon as LightningBoltOutlineIcon,
  PlusCircleIcon as PlusCircleOutlineIcon,
  ClipboardListIcon as ClipboardListOutlineIcon,
  PencilAltIcon as PencilAltOutlineIcon,
  UserGroupIcon as UserGroupOutlineIcon,
  UserIcon as UserOutlineIcon,
  SearchIcon as SearchOutlineIcon,
  CogIcon as CogOutlineIcon,
  MoonIcon as MoonOutlineIcon,
  CreditCardIcon as CreditCardOutlineIcon
} from "@heroicons/react/outline";

// Import Solid Icons
import {
  LightningBoltIcon as LightningBoltSolidIcon,
  PlusCircleIcon as PlusCircleSolidIcon,
  ClipboardListIcon as ClipboardListSolidIcon,
  PencilAltIcon as PencilAltSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
  UserIcon as UserSolidIcon,
  SearchIcon as SearchSolidIcon,
  CogIcon as CogSolidIcon,
  SunIcon as SunSolidIcon,
  CreditCardIcon as CreditCardSolidIcon
} from "@heroicons/react/solid";

import ChatIcon from "./ChatIcon/ChatIcon";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  const toggleNav = () => setNavOpen(!navOpen);

  useEffect(() => {
    // Check if user has a saved preference
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

  // Reusable NavItem Component for Main Navigation
  const NavItem = ({ href, label, IconOutline, IconSolid }) => {
    const isActive = pathname === href; // Determine if the link is active based on pathname
    return (
      <li className={`text-xl p-2 ${isActive ? "bg-highlight rounded-lg" : ""}`}>
        <Link
          href={href}
          onClick={() => {
            setNavOpen(false);
          }}
          className="flex items-center space-x-2"
        >
          {isActive ? (
            <IconSolid className="h-6 w-6 text-primary-text" />
          ) : (
            <IconOutline className="h-6 w-6 text-primary-text" />
          )}
          <span>{label}</span>
        </Link>
      </li>
    );
  };

  // Reusable QuickNavItem Component for Bottom Quick Navigation
  const QuickNavItem = ({ href, IconOutline, IconSolid }) => {
    const isActive = pathname === href; // Determine if the link is active based on pathname
    return (
      <Link href={href}>
        <div
          onClick={() => setNavOpen(false)}
          className={`flex flex-col items-center space-y-1 ${
            isActive ? "text-primary-text" : "text-primary-text"
          }`}
        >
          {isActive ? (
            <IconSolid className="h-6 w-6" />
          ) : (
            <IconOutline className="h-6 w-6" />
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="relative">
      {/* Top Bar for Small Screens */}
      <div className="fixed top-0 left-0 w-full h-16 bg-background flex items-center justify-between px-4 shadow-md md:hidden z-50">
        {/* App Logo */}
        <Link href={pathname === "/workouts/current" ? "/workouts/current" : "/"}>
          <div className="flex items-center space-x-2 sm:hidden">
            <Image
              src={!isDarkMode ? "/logo.png" : "/dark-logo.png"}
              alt="App Logo"
              width={32}
              height={32}
            />
            <h2 className="font-bold text-lg relative">
              JFit <em className="absolute text-xs">Classic</em>
            </h2>
          </div>
        </Link>

        {/* Hamburger Button */}
        <button
          aria-label="Toggle Navigation Menu" // Accessibility: ARIA label
          className="flex flex-col items-center justify-center space-y-1 w-8 h-8 bg-background text-primary-text rounded-md z-50"
          onClick={toggleNav}
        >
          <span
            className={`block w-6 h-1 bg-primary-text transform transition-transform duration-300 ${
              navOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-1 bg-primary-text transition-opacity duration-300 ${
              navOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-1 bg-primary-text transform transition-transform duration-300 ${
              navOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 h-full w-full bg-background dark:bg-background dark:text-primary-text md:w-64 shadow-lg transform transition-transform duration-300 z-40 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:fixed md:w-80`}
      >
        <ul className="flex flex-col justify-between p-8 h-screen max-h-[100%]">
          {/* Logo */}
          <Link href="/">
            <div className="w-full flex flex-col items-center hidden sm:flex ">
              <Image
                src={!isDarkMode ? "/logo.png" : "/dark-logo.png"}
                alt="App logo"
                width={80}
                height={80}
                className="mx-auto"
              />
              <h2 className="font-bold text-3xl inter-bold">JFit</h2>
            </div>
          </Link>

          {/* Navigation Links */}
          <ul className="flex flex-col space-y-2">
            <p className="border-b-2">Training</p>
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
            <NavItem
              href="/custom-excercises"
              label="Custom Exercises"
              IconOutline={PencilAltOutlineIcon}
              IconSolid={PencilAltSolidIcon}
            />
          </ul>

          <ul className="flex flex-col space-y-2">
            <p className="border-b-2">Coaching</p>
            <NavItem
              href="/coaching/clients"
              label="Clients"
              IconOutline={UserGroupOutlineIcon}
              IconSolid={UserGroupSolidIcon}
            />
          </ul>

          <ul className="flex flex-col space-y-2">
            <p className="border-b-2">User</p>
            <NavItem
              href="/profile"
              label="Profile"
              IconOutline={UserOutlineIcon}
              IconSolid={UserSolidIcon}
            />
            <NavItem
              href="/search"
              label="Search"
              IconOutline={SearchOutlineIcon}
              IconSolid={SearchSolidIcon}
            />
            <NavItem
              href="/settings"
              label="Settings"
              IconOutline={CogOutlineIcon}
              IconSolid={CogSolidIcon}

            />
            <NavItem
              href="/subscription"
              label="Subscription"
              IconOutline={CreditCardOutlineIcon}
              IconSolid={CreditCardSolidIcon}
            />
            <li className="text-xl p-2">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => {
                  toggleDarkMode();
                  setNavOpen(false); // Close the nav if needed
                }}
                aria-label="Toggle Dark Mode" // Accessibility: ARIA label
              >
                {isDarkMode ? (
                  <>
                    <SunSolidIcon className="h-6 w-6 text-primary-text" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <MoonOutlineIcon className="h-6 w-6 text-primary-text" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </li>
          </ul>

          <button
            className="bg-background-secondary text-xl rounded p-2 mt-4 w-full"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </ul>
      </nav>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 w-full h-20 bg-background flex justify-around items-center px-4 shadow-md md:hidden z-30">
        <QuickNavItem
          href="/workouts/current"
          IconOutline={LightningBoltOutlineIcon}
          IconSolid={LightningBoltSolidIcon}
        />
        <QuickNavItem
          href="/search"
          IconOutline={SearchOutlineIcon}
          IconSolid={SearchSolidIcon}
        />
        <QuickNavItem
          href="/coaching/clients"
          IconOutline={UserGroupOutlineIcon}
          IconSolid={UserGroupSolidIcon}
        />
        <QuickNavItem
          href="/profile"
          IconOutline={UserOutlineIcon}
          IconSolid={UserSolidIcon}
        />
        <ChatIcon navbar={true} />
      </div>
    </div>
  );
}
