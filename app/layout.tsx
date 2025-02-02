"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ProtectedRoute from "./components/ProtectedRoute";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as PullToRefresh from "pulltorefreshjs";

// Function to update the <meta name="theme-color"> tag dynamically
const updateThemeColor = () => {
  const themeColorMetaTag = document.querySelector("meta[name='theme-color']");
  const isDarkMode = document.documentElement.classList.contains("dark");
  const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(
    isDarkMode ? "--background" : "--background-secondary"
  ).trim();

  if (themeColorMetaTag) {
    themeColorMetaTag.setAttribute("content", backgroundColor);
  }
};

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbarPaths = ["/register", "/login"];
  const shouldShowNavbar = !hideNavbarPaths.includes(pathname);

  useEffect(() => {
    // Initialize pull-to-refresh
    PullToRefresh.init({
      mainElement: "body", // Target the body for pull-to-refresh
      onRefresh: () => {
        console.log("Pull-to-refresh triggered");
        window.location.reload();
      },
    });

    return () => {
      PullToRefresh.destroyAll(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          registration.onupdatefound = () => {
            const newWorker = registration.installing;

            newWorker.onstatechange = () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                toast.info("A new version is available. Click to refresh.", {
                  position: "bottom-center",
                  autoClose: false,
                  onClick: () => {
                    window.location.reload();
                  },
                });
              }
            };
          };
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  useEffect(() => {
    // Check for user preference and apply dark mode
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    updateThemeColor();

    // Listen for changes in system theme preference
    const themeChangeListener = (e) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      updateThemeColor();
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", themeChangeListener);

    return () => {
      mediaQuery.removeEventListener("change", themeChangeListener);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="var(--background)" />
        <link rel="icon" href="/logo.jpg" sizes="192x192" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <SessionProvider>
        <body
          className={`antialiased flex flex-col md:flex-row max-h-screen h-screen overflow-auto pt-16 md:pt-0 bg-background text-primary-text dark:bg-background dark:text-primary-text font-sans inter-main`}
        >
          <ProtectedRoute>

            <main
              className={`flex-grow inter-main ${
                shouldShowNavbar ? "sm:ml-80" : ""
              } z-0 bg-background`}
            >
              {children}
            </main>

          </ProtectedRoute>

          <ToastContainer />
        </body>
      </SessionProvider>
    </html>
  );
}