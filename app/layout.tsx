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