'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      setIsChecking(false);
    }
  }, [token, router]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}