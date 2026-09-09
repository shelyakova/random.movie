'use client';

import { Header, FilmSection, CategoriesModal, LoadingSpinner, FilmModal } from "@/components";
import { useFilmsSection, useDebounce } from "@/hooks";
import { useState } from "react";

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
  const [isOpenFilmModal, setIsOpenFilmModal] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  const suggested = useFilmsSection(false, debouncedSearch);
  const previouslyWatched = useFilmsSection(true, debouncedSearch);

  const isLoading = suggested.isLoading || previouslyWatched.isLoading;

  return (
    <div className="flex flex-1 flex-col bg-zinc-100 dark:bg-black px-20">
      <Header searchValue={searchInput} onSearchChange={setSearchInput} onOpenCategoriesModal={() => setIsOpenCategoryModal(true)} onOpenFilmModal={() => setIsOpenFilmModal(true)} />

      <main className="flex flex-col gap-8 pb-10">
        <FilmSection
          title="Suggested to watch"
          films={suggested.data?.pages.flat() ?? []}
          onMore={() => suggested.fetchNextPage()}
          hasMore={suggested.hasNextPage}
          isLoading={suggested.isLoading}
        />
        <FilmSection
          title="Previously watched"
          films={previouslyWatched.data?.pages.flat() ?? []}
          onMore={() => previouslyWatched.fetchNextPage()}
          hasMore={previouslyWatched.hasNextPage}
          isLoading={previouslyWatched.isLoading}
        />
      </main>

      {isLoading && <LoadingSpinner />}

      {isOpenCategoryModal && <CategoriesModal onClose={() => setIsOpenCategoryModal(false)} />}
      {isOpenFilmModal && <FilmModal onClose={() => setIsOpenFilmModal(false)} />}
    </div>
  );
}
