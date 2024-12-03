"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LightningBoltIcon,
  PlusCircleIcon,
  ClipboardListIcon,
  PencilAltIcon,
  UserGroupIcon,
  UserIcon,
  SearchIcon,
  CogIcon,
  MoonIcon,
  SunIcon
} from "@heroicons/react/outline";
import ChatIcon from "./ChatIcon/ChatIcon";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/workouts/current");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleNav = () => setNavOpen(!navOpen);

  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };
  
  

  return (
    <div className="relative">
      {/* Top Bar for Small Screens */}
      <div className="fixed top-0 left-0 w-full h-16 bg-background flex items-center justify-between px-4 shadow-md md:hidden z-50">
        {/* App Logo */}
        <Link href="/workouts/current">
          <div className="flex items-center space-x-2 sm:hidden">
            <Image src={!isDarkMode ? "/logo.png" : "/dark-logo.png"} alt="App Logo" width={32} height={32} />
            <h2 className="font-bold text-lg relative">
              JFit <em className="absolute text-xs">Classic</em>
            </h2>
          </div>
        </Link>

        {/* Hamburger Button */}
        <button
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
            <li
              className={`text-xl p-2 ${
                activeLink === "/workouts/current"
                  ? "bg-highlight rounded-lg"
                  : ""
              }`}
            >
              <Link
                href="/workouts/current"
                onClick={() => {
                  setActiveLink("/workouts/current");
                  setNavOpen(false);
                }}
                className="flex items-center space-x-2"
              >
                <LightningBoltIcon className="h-6 w-6 text-primary-text" />
                <span>Current Workout</span>
              </Link>
            </li>
            <li
              className={`text-xl p-2 ${
                activeLink === "/create-program"
                  ? "bg-highlight rounded-lg"
                  : ""
              }`}
            >
              <Link
                href="/create-program"
                onClick={() => {
                  setActiveLink("/create-program");
                  setNavOpen(false);
                }}
                className="flex items-center space-x-2"
              >
                <PlusCircleIcon className="h-6 w-6 text-primary-text" />
                <span>New Program</span>
              </Link>
            </li>
            <li
              className={`text-xl p-2 ${
                activeLink === "/programs" ? "bg-highlight rounded-lg" : ""
              }`}
            >
              <Link
                href="/programs"
                onClick={() => {
                  setActiveLink("/programs");
                  setNavOpen(false);
                }}
                className="flex items-center space-x-2"
              >
                <ClipboardListIcon className="h-6 w-6 text-primary-text" />
                <span>Programs</span>
              </Link>
            </li>
            <li
              className={`text-xl p-2 ${
                activeLink === "/custom-excercises"
                  ? "bg-highlight rounded-lg"
                  : ""
              }`}
            >
              <Link
                href="/custom-excercises"
                onClick={() => {
                  setActiveLink("/custom-excercises");
                  setNavOpen(false);
                }}
                className="flex items-center space-x-2"
              >
                <PencilAltIcon className="h-6 w-6 text-primary-text" />
                <span>Custom Exercises</span>
              </Link>
            </li>
          </ul>

          <ul className="flex flex-col space-y-2">
            <p className="border-b-2">Coaching</p>
            <li
              className={`text-xl p-2 ${
                activeLink === "/coaching/clients"
                  ? "bg-highlight rounded-lg"
                  : ""
              }`}
            >
              <Link
                href="/coaching/clients"
                onClick={() => {
                  setActiveLink("/coaching/clients");
                  setNavOpen(false);
                }}
                className="flex items-center space-x-2"
              >
                <UserGroupIcon className="h-6 w-6 text-primary-text" />
                <span>Clients</span>
              </Link>
            </li>
          </ul>

          <ul className="flex flex-col space-y-2">
            <p className="border-b-2">User</p>
            <li
              className={`text-xl p-2 ${
                activeLink === "/profile" ? "bg-highlight rounded-lg" : ""
              }`}
            >
              <Link
                href="/profile"
                onClick={() => {
                  setActiveLink("/profile");
                  setNavOpen(false);
                }}
                className="flex items-center space-x-2"
              >
                <UserIcon className="h-6 w-6 text-primary-text" />
                <span>Profile</span>
              </Link>
            </li>
            <li
              className={`text-xl p-2 ${
                activeLink === "/search" ? "bg-highlight rounded-lg" : ""
              }`}
            >
              <Link
                href="/search"
                onClick={() => {
                  setActiveLink("/search");
                  setNavOpen(false);
                }}
                className="flex items-center space-x-2"
              >
                <SearchIcon className="h-6 w-6 text-primary-text" />
                <span>Search</span>
              </Link>
            </li>
            <li
              className={`text-xl p-2 ${
                activeLink === "/settings" ? "bg-highlight rounded-lg" : ""
              }`}
            >
              <Link
                href="/settings"
                onClick={() => {
                  setActiveLink("/settings");
                  setNavOpen(false);
                }}
                className="flex items-center space-x-2"
              >
                <CogIcon className="h-6 w-6 text-primary-text" />
                <span>Settings</span>
              </Link>
            </li>
            <li className="text-xl p-2">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => {
                  toggleDarkMode();
                  setNavOpen(false); // Close the nav if needed
                }}
              >
                {isDarkMode ? (
                  <>
                    <SunIcon className="h-6 w-6 text-primary-text" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-6 w-6 text-primary-text" />
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
            <div className="fixed bottom-0 left-0 w-full h-16 bg-background flex justify-around items-center px-4 shadow-md md:hidden z-30">
        <Link href="/workouts/current">
          <div className={`flex flex-col items-center space-y-1 ${activeLink === "/workouts/current" ? "text-highlight" : "text-primary-text"}`}>
            <LightningBoltIcon className="h-6 w-6" />
          </div>
        </Link>
        <Link href="/search">
          <div className={`flex flex-col items-center space-y-1 ${activeLink === "/search" ? "text-highlight" : "text-primary-text"}`}>
            <SearchIcon className="h-6 w-6" />
          </div>
        </Link>
        <Link href="/coaching/clients">
          <div className={`flex flex-col items-center space-y-1 ${activeLink === "/coaching/clients" ? "text-highlight" : "text-primary-text"}`}>
            <UserGroupIcon className="h-6 w-6" />
          </div>
        </Link>
        <Link href="/profile">
          <div className={`flex flex-col items-center space-y-1 ${activeLink === "/profile" ? "text-highlight" : "text-primary-text"}`}>
            <UserIcon className="h-6 w-6" />
          </div>
        </Link>
        <ChatIcon 
          navbar={true}/>
      </div>
    </div>
  );
}
