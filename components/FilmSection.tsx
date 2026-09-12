"use client";

import FilmCard from "./FilmCard";
import EmptyState from "./EmptyState";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { Film } from "@/lib/types";
import Link from "next/link";
import { useInfiniteScroll } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface FilmSectionProps {
  title: string;
  films: Film[];
  onMoreClick?: () => void;
  hasMoreButton?: boolean;
  onMoreData: () => void;
  hasMoreData: boolean;
  isLoading: boolean;
  hasSlider?: boolean;
  lazyLoad?: boolean;
  isLoadingNextPage?: boolean;
}

export default function FilmSection({
  title,
  films,
  onMoreClick,
  hasMoreButton,
  onMoreData,
  hasMoreData,
  isLoading,
  hasSlider,
  lazyLoad,
  isLoadingNextPage,
}: FilmSectionProps) {
  const sentinelRef = useInfiniteScroll(onMoreData, Boolean(lazyLoad && hasMoreData));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [films]);

  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  return (
    <section className="w-full">
      <h2 className="mb-[26px] text-[20px] font-medium text-black dark:text-white">{title}</h2>

      {films.length === 0 ? (
        <EmptyState message="No films found" />
      ) : (
        <div className="relative">
          <div
            ref={hasSlider ? scrollContainerRef : undefined}
            onScroll={hasSlider ? updateScrollButtons : undefined}
            className={
              hasSlider
                ? "no-scrollbar flex gap-3 overflow-x-auto scroll-smooth"
                : "grid grid-cols-6 gap-4"
            }
          >
            {films.map((film) => (
              <Link key={film.id} href={`/film/${film.id}`}>
                <FilmCard film={film} showName className="h-[263px] w-[177px]" />
              </Link>
            ))}
          </div>

          {hasSlider && canScrollLeft && (
            <button
              onClick={handleScrollLeft}
              className="absolute top-1/2 -left-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-600 shadow-md dark:bg-zinc-800 dark:text-zinc-300"
            >
              <ChevronLeftIcon />
            </button>
          )}
          {hasSlider && canScrollRight && (
            <button
              onClick={handleScrollRight}
              className="absolute top-1/2 -right-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-600 shadow-md dark:bg-zinc-800 dark:text-zinc-300"
            >
              <ChevronRightIcon />
            </button>
          )}
        </div>
      )}

      {lazyLoad
        ? hasMoreData && (
            <div ref={sentinelRef} className="mt-2 flex h-10 items-center justify-center">
              {isLoadingNextPage && <LoadingSpinner overlay={false} />}
            </div>
          )
        : hasMoreButton && (
            <p
              onClick={() => !isLoading && onMoreClick?.()}
              className="mt-2 cursor-pointer text-right text-sm font-medium text-zinc-500 dark:text-zinc-400"
            >
              More
            </p>
          )}
    </section>
  );
}
