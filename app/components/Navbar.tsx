"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PremiumIcon from "./PremiumIcon";
import { useSession } from "next-auth/react";

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
  CreditCardIcon as CreditCardOutlineIcon,
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
  CreditCardIcon as CreditCardSolidIcon,
} from "@heroicons/react/solid";

import "remixicon/fonts/remixicon.css";

// Custom Icons using Remix Icons
export const FoodOutlineIcon = ({ className }) => (
  <i className={`ri-restaurant-line ${className}`}></i> // Outline icon
);

export const FoodSolidIcon = ({ className }) => (
  <i className={`ri-restaurant-fill ${className}`}></i> // Solid icon
);

import ChatIcon from "./ChatIcon/ChatIcon";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [shownSection, setShownSection] = useState(null);

  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "USER";

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

  const getCurrentDateId = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}${month}${year}`;
  };

  const currentDateId = getCurrentDateId();

  const NavItem = ({ href, label, IconOutline, IconSolid, isPremium = false }) => {
    const isActive =
      href.startsWith("/nutrition/log")
        ? pathname.startsWith("/nutrition/log")
        : pathname === href;

    return (
      <li className={`text-xl p-2 ${isActive ? "bg-highlight rounded-lg" : ""}`}>
        <Link
          href={href}
          onClick={() => setNavOpen(false)}
          className="flex items-center space-x-2 relative"
        >
          {isActive ? (
            <IconSolid className="h-6 w-6 text-primary-text" />
          ) : (
            <IconOutline className="h-6 w-6 text-primary-text" />
          )}
          <span className={`${isActive ? "inter-bold" : "inter-main"}`}>{label}</span>
          {isPremium && userRole !== "PREMIUM" && (
            <PremiumIcon text={`${label} has premium features`} />
          )}
        </Link>
      </li>
    );
  };

  const QuickNavItem = ({ href, IconOutline, IconSolid }) => {
    const isActive = pathname === href;
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

  const sections = [
    {
      name: "Training",
      links: [
        {
          href: "/workouts/current",
          label: "Current Workout",
          IconOutline: LightningBoltOutlineIcon,
          IconSolid: LightningBoltSolidIcon,
        },
        {
          href: "/create-program",
          label: "New Program",
          IconOutline: PlusCircleOutlineIcon,
          IconSolid: PlusCircleSolidIcon,
          isPremium: true,
        },
        {
          href: "/programs",
          label: "Programs",
          IconOutline: ClipboardListOutlineIcon,
          IconSolid: ClipboardListSolidIcon,
        },
        {
          href: "/custom-excercises",
          label: "Custom Exercises",
          IconOutline: PencilAltOutlineIcon,
          IconSolid: PencilAltSolidIcon,
          isPremium: true,
        },
      ],
    },
    {
      name: "Nutrition",
      links: [
        {
          href: `/nutrition/log/${currentDateId}`,
          label: "Log",
          IconOutline: FoodOutlineIcon,
          IconSolid: FoodSolidIcon,
          isPremium: true,
        },
        {
          href: "/custom-foods",
          label: "Custom Foods",
          IconOutline: PencilAltOutlineIcon,
          IconSolid: PencilAltSolidIcon,
          isPremium: true,
        },
      ],
    },
    {
      name: "Coaching",
      links: [
        {
          href: "/coaching/clients",
          label: "Clients",
          IconOutline: UserGroupOutlineIcon,
          IconSolid: UserGroupSolidIcon,
          isPremium: true,
        },
      ],
    },
    {
      name: "User",
      links: [
        {
          href: "/profile",
          label: "Profile",
          IconOutline: UserOutlineIcon,
          IconSolid: UserSolidIcon,
        },
        {
          href: "/search",
          label: "Search",
          IconOutline: SearchOutlineIcon,
          IconSolid: SearchSolidIcon,
        },
        {
          href: "/settings",
          label: "Settings",
          IconOutline: CogOutlineIcon,
          IconSolid: CogSolidIcon,
        },
        {
          href: "/subscription",
          label: "Subscription",
          IconOutline: CreditCardOutlineIcon,
          IconSolid: CreditCardSolidIcon,
        },
      ],
    },
  ];

  const handleSectionClick = (sectionName) => {
    if (shownSection === sectionName) {
      setShownSection(null);
    } else {
      setShownSection(sectionName);
    }
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
          aria-label="Toggle Navigation Menu"
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
        <ul className="flex flex-col justify-between p-8 h-screen max-h-[100%] overflow-y-auto">
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

          {/* Sections */}
          <div className="flex flex-col space-y-2">
            {sections.map((section) => {
              const isShown = shownSection === section.name;
              return (
                <div key={section.name} className="flex flex-col">
                  {/* Section Heading */}
                  <button
                    onClick={() => handleSectionClick(section.name)}
                    className="flex items-center justify-between w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    aria-expanded={isShown ? "true" : "false"}
                  >
                    <span className={`inter-bold text-xl`}>{section.name}</span>
                    {/* Indicator Icon */}
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-300 ${
                        isShown ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Collapsible NavLinks */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isShown ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="pl-4 mt-2 space-y-1">
                      {section.links.map((link) => (
                        <NavItem
                          key={link.href}
                          href={link.href}
                          label={link.label}
                          IconOutline={link.IconOutline}
                          IconSolid={link.IconSolid}
                          isPremium={link.isPremium}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mode Toggle and Sign Out */}
          <ul className="flex flex-col space-y-2 mt-4">
            <li className="text-xl p-2">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => {
                  toggleDarkMode();
                  setNavOpen(false);
                }}
                aria-label="Toggle Dark Mode"
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
            <button
              className="bg-background-secondary text-xl rounded p-2 w-full"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </ul>
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