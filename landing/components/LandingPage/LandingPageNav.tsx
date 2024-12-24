"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/outline";
import styles from './LandingPageNav.module.css'
import Link from "next/link";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <>
      <div className={styles.nav}>
          <input type="checkbox" checked={navOpen} onChange={toggleNav} />
          <svg>
            <use className={styles.use1} xlinkHref="#menu" />
            <use className={styles.use2} xlinkHref="#menu" />
          </svg>
        
          {/* Hidden SVG Symbol */}
          <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
            <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 56" id="menu">
              <path d="M48.33,45.6H18a14.17,14.17,0,0,1,0-28.34H78.86a17.37,17.37,0,0,1,0,34.74H42.33l-21-21.26L47.75,4" />
            </symbol>
          </svg>
        
      </div>

      {/* Navbar */}
      <nav
        className={`navbar fixed top-0 right-0 h-full w-full bg-background dark:bg-background dark:text-primary-text md:w-96 shadow-lg transform transition-transform duration-300 z-20 ${
          navOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Navbar Content */}
        <ul className="flex flex-col space-y-2 p-4 z-30">
        <li className="text-xl p-2">
            <button
              className="flex items-center space-x-2 focus:outline-none"
            >
              <Link href='/jfit'>
                Jfit
              </Link>
            </button>
          </li>
          <li className="text-xl p-2">
            <button
              className="flex items-center space-x-2 focus:outline-none"
            >
              <Link href='/posts'>
                Jfinance
              </Link>
            </button>
          </li>
        <li className="text-xl p-2">
            <button
              className="flex items-center space-x-2 focus:outline-none"
            >
              <Link href='/map'>
                Personal website
              </Link>
            </button>
          </li>
          <li className="text-xl p-2">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={toggleDarkMode}
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
          {/* Add other nav items here */}
        </ul>
      </nav>
    </>
  );
}
