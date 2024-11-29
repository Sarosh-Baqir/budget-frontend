"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      setIsLoading(false); // Stop loading once the token is verified
    }
  }, [router]);

  // While checking for authentication, display a loading screen
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>; // Render children if token is found and valid
}
