"use client";

import { Suspense } from "react";
import { FilmSection, LoadingSpinner, Tag } from "@/components";
import { TagTone, ViewKey } from "@/lib/types";
import { useFilms, useDebounce, useCategories, useSearchNavigation } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SLIDER_LIMIT, EXPANDED_LIMIT, SEARCH_LIMIT } from "@/lib/constants/responsive";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expandedSection = searchParams.get("view");

  const { currentSearch, currentCategoryIds, currentNewSeasonOut, currentHasLatestEpisode } =
    useSearchNavigation();
  const debouncedSearch = useDebounce(currentSearch, 500);
  const isFiltering =
    Boolean(debouncedSearch) ||
    currentCategoryIds.length > 0 ||
    currentNewSeasonOut ||
    currentHasLatestEpisode;

  const suggested = useFilms({
    isWatched: false,
    search: debouncedSearch,
    limit: expandedSection === ViewKey.Suggested ? EXPANDED_LIMIT : SLIDER_LIMIT,
  });
  const previouslyWatched = useFilms({
    isWatched: true,
    search: debouncedSearch,
    limit: expandedSection === ViewKey.Watched ? EXPANDED_LIMIT : SLIDER_LIMIT,
  });
  const searchResults = useFilms({
    search: debouncedSearch,
    categoryIds: currentCategoryIds,
    limit: SEARCH_LIMIT,
    newSeasonOut: currentNewSeasonOut,
    hasLatestEpisode: currentHasLatestEpisode,
  });

  const { data: categories = [] } = useCategories();
  const selectedCategoryNames = categories
    .filter((c) => currentCategoryIds.includes(c.id))
    .map((c) => c.name);

  const isLoading = suggested.isLoading || previouslyWatched.isLoading || searchResults.isLoading;

  return (
    <>
      <main className="tv:gap-5 flex flex-col gap-8 pb-10">
        <h1 className="sr-only">Home</h1>

        {isFiltering ? (
          <>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Showing search results for:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {debouncedSearch && (
                  <Tag readOnly tone={TagTone.Neutral}>
                    {debouncedSearch}
                  </Tag>
                )}
                {currentNewSeasonOut && (
                  <Tag readOnly tone={TagTone.Outline}>
                    New season
                  </Tag>
                )}
                {currentHasLatestEpisode && (
                  <Tag readOnly tone={TagTone.Outline}>
                    Latest episode
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

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner overlay={false} className="flex-1" />}>
      <HomeContent />
    </Suspense>
  );
}
