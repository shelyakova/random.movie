"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/lib/stores";
import { CategoriesModal, ConfirmModal, FilmModal, Header, LoadingSpinner } from "@/components";
import { useIsHydrated, useRandomFilm, useSearchNavigation } from "@/hooks";

function ProtectedLayoutContent({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth");
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const router = useRouter();

  const isHydrated = useIsHydrated();
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
    }
  }, [token, router]);

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  if (!isHydrated || !token) {
    return null;
  }

  return (
    <div className="bg-background mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
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
          title={t("logoutConfirm")}
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
