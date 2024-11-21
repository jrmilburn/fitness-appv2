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
import PullToRefresh from "./components/PullToRefresh";

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

  const refreshData = async () => {
    window.location.reload();
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fff" />
        <link rel="icon" href="/logo.jpg" sizes="192x192" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <SessionProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col md:flex-row min-h-screen`}
        >
          <ProtectedRoute>
            {/* Navbar */}
            {shouldShowNavbar && <Navbar />}

            <PullToRefresh
              onRefresh={refreshData}
            >
            {/* Main Content */}
            <main
              className={`flex-grow max-h-screen ${
                shouldShowNavbar ? "pt-16 md:pt-0" : ""
              } overflow-y-auto z-0`}
            >
              {children}
            </main>
            </PullToRefresh>

            {/* Chat Icon */}
            {shouldShowNavbar && <ChatIcon />}
          </ProtectedRoute>

          <ToastContainer />
        </body>
      </SessionProvider>
    </html>
  );
}