'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores';
import { CategoriesModal, FilmModal, Header } from '@/components';
import { useSearchNavigation } from '@/hooks';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [isOpenFilmModal, setIsOpenFilmModal] = useState(false);
  const { currentSearch, handleSearchChange } = useSearchNavigation();

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

  return (
    <div className="flex flex-1 flex-col bg-zinc-100 dark:bg-black px-20">
      <Header
        searchValue={currentSearch}
        onSearchChange={handleSearchChange}
        onOpenCategoriesModal={() => setIsOpenCategoryModal(true)}
        onOpenFilmModal={() => setIsOpenFilmModal(true)}
      />
      {children}

      {isOpenCategoryModal && <CategoriesModal onClose={() => setIsOpenCategoryModal(false)} />}
      {isOpenFilmModal && <FilmModal onClose={() => setIsOpenFilmModal(false)} />}
    </div>
  );
}