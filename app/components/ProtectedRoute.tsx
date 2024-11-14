"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image'
import LandingPage from "../landingpage/page";

export default function ProtectedRoute({ children }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isFading, setIsFading] = useState(false);

  const unprotectedPaths = ["/landingpage/register", "/landingpage/login"];
  const isUnprotectedPath = unprotectedPaths.includes(pathname);

  useEffect(() => {
    if (status === "unauthenticated" && !isUnprotectedPath) {
      router.push("/landingpage");
    }
  }, [status, router, isUnprotectedPath]);

  useEffect(() => {
    if (status === "loading") {
      // Delay the fade-out of the splash screen for a smoother transition
      setTimeout(() => setIsFading(true), 1000); // Adjust timing as needed
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-500 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Splash Screen Content */}
        <div className="text-center">
          <div className="animate-bounce">
            <Image src="/logo.jpg" alt="App logo" width={80} height={80} className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mt-4">Welcome to JFit</h1>
        </div>
      </div>
    );
  }

  return status === "authenticated" || isUnprotectedPath ? (
    children
  ) : (
    <LandingPage />
  );
}