"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import { SessionProvider } from "next-auth/react";
import ProtectedRoute from "./components/ProtectedRoute";
import { usePathname } from "next/navigation";
import ChatIcon from "./components/ChatIcon/ChatIcon";

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

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icon-192x192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <SessionProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
        >
          <ProtectedRoute>
            {/* Top Bar and Navbar */}
            {shouldShowNavbar && (
              <div className="relative">
                <Navbar />
              </div>
            )}

            {/* Content Area */}
            <div
              className={`${
                shouldShowNavbar ? "pt-16 md:pt-0 w-full" : ""
              } overflow-y-hidden`}
            >
              {children}
            </div>

            <ChatIcon />
          </ProtectedRoute>
        </body>
      </SessionProvider>
    </html>
  );
}