"use client";

import { FilmSection, LoadingSpinner, Tag } from "@/components";
import { TagTone } from "@/components/Tag";
import { useFilms, useDebounce, useCategories, useSearchNavigation } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export enum ViewKey {
  Suggested = "suggested",
  Watched = "watched",
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expandedSection = searchParams.get("view");

  const { currentSearch, currentCategoryIds } = useSearchNavigation();
  const debouncedSearch = useDebounce(currentSearch, 500);
  const isFiltering = Boolean(debouncedSearch) || currentCategoryIds.length > 0;

  const suggested = useFilms({
    isWatched: false,
    search: debouncedSearch,
    categoryIds: currentCategoryIds,
    limit: expandedSection === ViewKey.Suggested ? 18 : 10,
  });
  const previouslyWatched = useFilms({
    isWatched: true,
    search: debouncedSearch,
    categoryIds: currentCategoryIds,
    limit: expandedSection === ViewKey.Watched ? 18 : 10,
  });
  const searchResults = useFilms({
    search: debouncedSearch,
    categoryIds: currentCategoryIds,
    limit: 12,
  });

  const { data: categories = [] } = useCategories();
  const selectedCategoryNames = categories
    .filter((c) => currentCategoryIds.includes(c.id))
    .map((c) => c.name);

  const isLoading = suggested.isLoading || previouslyWatched.isLoading || searchResults.isLoading;

  return (
    <>
      <main className="flex flex-col gap-8 pb-10">
        {isFiltering ? (
          <>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Showing search results for:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {debouncedSearch && (
                  <Tag readOnly tone={TagTone.Neutral}>
                    {debouncedSearch}
                  </Tag>
                )}
                {selectedCategoryNames.map((name) => (
                  <Tag key={name} readOnly tone={TagTone.Info}>
                    {name}
                  </Tag>
                ))}
              </div>
            </div>

            <FilmSection
              title=""
              films={searchResults.data?.pages.flat() ?? []}
              onMoreData={() => searchResults.fetchNextPage()}
              hasMoreData={searchResults.hasNextPage}
              lazyLoad
              isLoading={searchResults.isLoading}
            />
          </>
        ) : (
          <>
            {(!expandedSection || expandedSection === ViewKey.Suggested) && (
              <FilmSection
                title="Suggested to watch"
                hasSlider={!expandedSection}
                films={suggested.data?.pages.flat() ?? []}
                onMoreClick={() => router.push(`/?view=${ViewKey.Suggested}`)}
                hasMoreButton={expandedSection !== ViewKey.Suggested}
                onMoreData={() => suggested.fetchNextPage()}
                hasMoreData={suggested.hasNextPage}
                lazyLoad={expandedSection === ViewKey.Suggested}
                isLoading={suggested.isLoading}
                isLoadingNextPage={suggested.isFetchingNextPage}
              />
            )}
            {(!expandedSection || expandedSection === ViewKey.Watched) && (
              <FilmSection
                title="Previously watched"
                hasSlider={!expandedSection}
                films={previouslyWatched.data?.pages.flat() ?? []}
                onMoreClick={() => router.push(`/?view=${ViewKey.Watched}`)}
                hasMoreButton={expandedSection !== ViewKey.Watched}
                onMoreData={() => previouslyWatched.fetchNextPage()}
                hasMoreData={previouslyWatched.hasNextPage}
                lazyLoad={expandedSection === ViewKey.Watched}
                isLoading={previouslyWatched.isLoading}
                isLoadingNextPage={previouslyWatched.isFetchingNextPage}
              />
            )}
          </>
        )}
      </main>

      {isLoading && <LoadingSpinner />}
    </>
  );
}
