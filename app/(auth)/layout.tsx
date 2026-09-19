"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores";
import { useIsHydrated } from "@/hooks";
import { Logo } from "@/components";
import { LogoSize } from "@/lib/types";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  if (!isHydrated || token) {
    return null;
  }

  return (
    <div className="bg-background flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Logo size={LogoSize.Large} />
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
