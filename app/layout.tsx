"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import { SessionProvider } from "next-auth/react";
import ProtectedRoute from "./components/ProtectedRoute";
import { usePathname } from "next/navigation";
import ChatIcon from "./components/ChatIcon/ChatIcon";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as PullToRefresh from "pulltorefreshjs"; // Updated import

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbarPaths = ["/landingpage/register", "/landingpage/login"];
  const shouldShowNavbar = !hideNavbarPaths.includes(pathname);

  useEffect(() => {
    PullToRefresh.init({
      mainElement: "#main-content", // Updated selector
      onRefresh: async () => {
        console.log("Pull-to-refresh triggered");
        window.location.reload();
      },
      shouldPullToRefresh: () => {
        const main = document.getElementById("main-content");
        return main ? main.scrollTop === 0 : false;
      }, // Only trigger at the top of the main element
    });

    return () => {
      PullToRefresh.destroyAll(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
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

  return (
    <html lang="en">
      <head>
        {/* ... your head content ... */}
      </head>
      <SessionProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col md:flex-row max-h-screen h-screen`}
        >
          <ProtectedRoute>
            {shouldShowNavbar && <Navbar />}

            <main
              id="main-content" // Added ID for specificity
              className={`flex-grow overflow-auto scroll-smooth ${
                shouldShowNavbar ? "mt-16 md:mt-0" : ""
              } z-0`}
            >
              {children}
            </main>

            {shouldShowNavbar && <ChatIcon />}
          </ProtectedRoute>

          <ToastContainer />
        </body>
      </SessionProvider>
    </html>
  );
}
