'use client';

import { FilmSection, LoadingSpinner } from "@/components";
import { useFilmsSection, useDebounce } from "@/hooks";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const debouncedSearch = useDebounce(searchQuery, 500);

  const suggested = useFilmsSection(false, debouncedSearch);
  const previouslyWatched = useFilmsSection(true, debouncedSearch);

  const isLoading = suggested.isLoading || previouslyWatched.isLoading;

  return (
    <>
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
    </>
  );
}
