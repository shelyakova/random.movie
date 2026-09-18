"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores";
import { CategoriesModal, ConfirmModal, FilmModal, Header, LoadingSpinner } from "@/components";
import { useRandomFilm, useSearchNavigation } from "@/hooks";

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [isOpenFilmModal, setIsOpenFilmModal] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const {
    currentSearch,
    currentCategoryIds,
    handleSearchChange,
    currentNewSeasonOut,
    currentHasLatestEpisode,
    buildParams,
  } = useSearchNavigation();
  const randomFilm = useRandomFilm();

  const handleRandomize = () => {
    randomFilm.mutate({
      search: currentSearch,
      categoryIds: currentCategoryIds,
      newSeasonOut: currentNewSeasonOut,
      hasLatestEpisode: currentHasLatestEpisode,
      filterParams: buildParams().toString(),
    });
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setIsChecking(false);
    }
  }, [token, router]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  if (isChecking) {
    return null;
  }

  return (
    <div className="bg-background flex flex-1 flex-col px-20">
      <Header
        searchValue={currentSearch}
        onSearchChange={handleSearchChange}
        onOpenLogoutConfirmModal={() => setIsLogoutConfirmOpen(true)}
        onOpenCategoriesModal={() => setIsOpenCategoryModal(true)}
        onOpenFilmModal={() => setIsOpenFilmModal(true)}
        onClickRandomize={handleRandomize}
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

      {randomFilm.isPending && <LoadingSpinner />}
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </Suspense>
  );
}
