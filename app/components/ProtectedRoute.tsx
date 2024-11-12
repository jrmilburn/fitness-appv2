"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "../landingpage/page";

export default function ProtectedRoute({ children }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const unprotectedPaths = ["/landingpage/register", "/landingpage/login"];
  const isUnprotectedPath = unprotectedPaths.includes(pathname);

  useEffect(() => {
    if (status === "unauthenticated" && !isUnprotectedPath) {
      router.push("/landingpage");
    }
  }, [status, router, isUnprotectedPath]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return status === "authenticated" || isUnprotectedPath ? (
    children
  ) : (
    <LandingPage />
  );
}