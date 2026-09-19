"use client";

import FilmCard from "./FilmCard";
import EmptyState from "./EmptyState";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { Film } from "@/lib/types";
import Link from "next/link";
import { useInfiniteScroll } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Tooltip from "./Tooltip";
import { GRID_CARD_CLASS, GRID_CLASS, SLIDER_CARD_CLASS } from "@/lib/constants/responsive";

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
      {title && (
        <h2 className="text-foreground tv:mb-4 mb-[26px] text-[20px] font-medium">{title}</h2>
      )}

      {films.length === 0 ? (
        <EmptyState message="No films found" />
      ) : (
        <div className="relative">
          <div
            ref={hasSlider ? scrollContainerRef : undefined}
            onScroll={hasSlider ? updateScrollButtons : undefined}
            className={
              hasSlider
                ? "no-scrollbar -mx-1 -my-1 flex gap-3 overflow-x-auto scroll-smooth px-1 py-1"
                : GRID_CLASS
            }
          >
            {films.map((film) => (
              <Link
                key={film.id}
                href={`/film/${film.id}`}
                className={`focus-ring rounded-xl ${hasSlider ? "shrink-0" : "block min-w-0"}`}
              >
                <FilmCard
                  film={film}
                  showName
                  showDateIcons
                  className={hasSlider ? SLIDER_CARD_CLASS : GRID_CARD_CLASS}
                />
              </Link>
            ))}
          </div>

          {hasSlider && canScrollLeft && (
            <Tooltip
              content="Scroll left"
              className="absolute top-1/2 -translate-y-1/2 max-md:hidden! md:-left-9 lg:-left-10"
            >
              <button
                onClick={handleScrollLeft}
                className="bg-surface text-secondary-foreground focus-ring relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-md before:absolute before:-inset-1.5 before:content-['']"
              >
                <ChevronLeftIcon />
              </button>
            </Tooltip>
          )}
          {hasSlider && canScrollRight && (
            <Tooltip
              content="Scroll right"
              className="absolute top-1/2 -translate-y-1/2 max-md:hidden! md:-right-9 lg:-right-10"
            >
              <button
                onClick={handleScrollRight}
                className="bg-surface text-secondary-foreground focus-ring relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-md before:absolute before:-inset-1.5 before:content-['']"
              >
                <ChevronRightIcon />
              </button>
            </Tooltip>
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
            <button
              type="button"
              onClick={() => !isLoading && onMoreClick?.()}
              className="text-muted-foreground focus-ring flex min-h-11 w-full cursor-pointer appearance-none items-center justify-end rounded-lg border-0 bg-transparent p-0 text-sm font-medium"
            >
              More
            </button>
          )}
    </section>
  );
}
