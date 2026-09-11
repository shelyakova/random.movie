'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores';
import { CategoriesModal, ConfirmModal, FilmModal, Header } from '@/components';
import { useSearchNavigation } from '@/hooks';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [isOpenFilmModal, setIsOpenFilmModal] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const { currentSearch, handleSearchChange } = useSearchNavigation();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      setIsChecking(false);
    }
  }, [token, router]);

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  if (isChecking) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-100 dark:bg-black px-20">
      <Header
        searchValue={currentSearch}
        onSearchChange={handleSearchChange}
        onOpenLogoutConfirmModal={() => setIsLogoutConfirmOpen(true)}
        onOpenCategoriesModal={() => setIsOpenCategoryModal(true)}
        onOpenFilmModal={() => setIsOpenFilmModal(true)}
      />
      {children}

      {isOpenCategoryModal && <CategoriesModal onClose={() => setIsOpenCategoryModal(false)} />}
      {isOpenFilmModal && <FilmModal onClose={() => setIsOpenFilmModal(false)} />}

      {isLogoutConfirmOpen && (
        <ConfirmModal
          title="Are you sure you want to logout?"
          message=""
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutConfirmOpen(false)}
        />
      )}
    </div>
  );
}