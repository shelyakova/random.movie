"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores";
import { Logo, LogoSize } from "@/components";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (token) {
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [token, router]);

  if (isChecking) {
    return null;
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-white px-4 dark:bg-black">
      <div className="w-full max-w-sm">
        <Logo size={LogoSize.Large} />
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
