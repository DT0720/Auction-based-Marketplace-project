"use client"

import { ROUTES } from "@/application/routing/routes";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // If the user is not authenticated, redirect to login page
      router.push(ROUTES.LOGIN);
    } else {
      // If the user is authenticated, redirect based on user type
      if (user?.type.toLowerCase() === "b") {
        router.push(ROUTES.BUYER_DASHBOARD);
      } else if (user?.type.toLowerCase() === "s") {
        router.push(ROUTES.SELLER_DASHBOARD);
      }
    }
  }, [isAuthenticated, user, router]);

  return null; // No UI to render since the component handles only redirection
}
