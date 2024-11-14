"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';
import LandingPage from "../landingpage/page";

export default function ProtectedRoute({ children }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  const unprotectedPaths = ["/landingpage/register", "/landingpage/login"];
  const isUnprotectedPath = unprotectedPaths.includes(pathname);

  useEffect(() => {
    if (status === "unauthenticated" && !isUnprotectedPath) {
      router.push("/landingpage");
    }
  }, [status, router, isUnprotectedPath]);

  useEffect(() => {
    // Minimum display time for the splash screen (1 second)
    const timer = setTimeout(() => {
      setShouldFadeOut(true); // Trigger fade-out
    }, 1000);

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <>
      {/* Render main content underneath the splash screen */}
      {(status === "authenticated" || isUnprotectedPath) ? children : <LandingPage />}

      {/* Splash screen overlay */}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-500 ${
          shouldFadeOut ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ zIndex: 50, pointerEvents: shouldFadeOut ? 'none' : 'auto' }}
      >
        <div className="text-center">
          <div className="animate-bounce">
            <Image src="/logo.jpg" alt="App logo" width={80} height={80} className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mt-4">Welcome to JFit</h1>
        </div>
      </div>
    </>
  );
}