'use client';

import { FilmSection, LoadingSpinner, Tag } from "@/components";
import { TagTone } from "@/components/Tag";
import { useFilms, useDebounce, useCategories } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';

export enum ViewKey {
  Suggested = "suggested",
  Watched = "watched",
}

export default function Home() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const categoryIds = searchParams.getAll('categoryIds').map(Number);
  const expandedSection = searchParams.get('view');

  const debouncedSearch = useDebounce(searchQuery, 500);
  const isFiltering = Boolean(debouncedSearch) || categoryIds.length > 0;

  const suggested = useFilms({ isWatched: false, search: debouncedSearch, categoryIds, limit: expandedSection === ViewKey.Suggested ? 18 : 10 });
  const previouslyWatched = useFilms({ isWatched: true, search: debouncedSearch, categoryIds, limit: expandedSection === ViewKey.Watched ? 18 : 10 });
  const searchResults = useFilms({ search: debouncedSearch, categoryIds, limit: 12 });

  const { data: categories = [] } = useCategories();
  const selectedCategoryNames = categories.filter((c) => categoryIds.includes(c.id)).map((c) => c.name);

  const isLoading = suggested.isLoading || previouslyWatched.isLoading || searchResults.isLoading;

  return (
    <>
      <main className="flex flex-col gap-8 pb-10">
        {isFiltering ? (
          <>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Showing search results for:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {debouncedSearch && (
                  <Tag readOnly tone={TagTone.Neutral}>{debouncedSearch}</Tag>
                )}
                {selectedCategoryNames.map((name) => (
                  <Tag key={name} readOnly tone={TagTone.Info}>{name}</Tag>
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
            {(!expandedSection || expandedSection === ViewKey.Suggested) &&
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
              />
            }
            {(!expandedSection || expandedSection === ViewKey.Watched) &&
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
              />
            }

          </>
        )}
      </main>

      {isLoading && <LoadingSpinner />}
    </>
  );
}

