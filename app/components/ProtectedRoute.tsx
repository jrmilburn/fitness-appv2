// app/components/ProtectedRoute.tsx

'use client';

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Define paths that do not require authentication
  const unprotectedPaths = ["/login"];
  const isUnprotectedPath = unprotectedPaths.includes(pathname);

  useEffect(() => {
    // Ensure the code runs only on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Redirect unauthenticated users to /login if they're accessing protected routes
    if (status === "unauthenticated" && !isUnprotectedPath && isClient) {
      router.push("/login");
    }
  }, [status, router, isUnprotectedPath, isClient]);

  if (status === "loading") {
    // Display a loading or splash screen while fetching session data
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="animate-bounce">
            <Image src="/logo.png" alt="App logo" width={80} height={80} className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mt-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (status === "authenticated" || isUnprotectedPath) {
    // Render the protected content if authenticated or if the path is unprotected
    return <>{children}</>;
  }

  // Optionally, render nothing or a fallback UI while redirecting
  return null;
}