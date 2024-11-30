/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { ROUTES } from "@/application/routing/routes";
import { Button } from "@/components/ui/button";
import { errorMessage, successMessage, warningMessage } from "@/components/ui/custom/Toast";
import { ToastAction } from "@/components/ui/toast";
import { useLoader } from "@/hooks/use-loader";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={() => router.push(ROUTES.BUYER_DASHBOARD)}>Click me</button>
    </div>
  );
}
