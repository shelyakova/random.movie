import FilmCard from "./FilmCard";
import EmptyState from "./EmptyState";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { Film } from "@/lib/types";
import Link from "next/link";
import { useInfiniteScroll } from "@/hooks";
import { useEffect, useRef, useState } from "react";

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
}

export default function FilmSection({ title, films, onMoreClick, hasMoreButton, onMoreData, hasMoreData, isLoading, hasSlider, lazyLoad }: FilmSectionProps) {
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
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };

  return (
    <section className="w-full">
      <h2 className='mb-[26px] text-[20px] font-medium text-black dark:text-white'>
        {title}
      </h2>

      {films.length === 0 ? (
        <EmptyState message="No films found" />
      ) : (
        <div className="relative">
          <div
            ref={hasSlider ? scrollContainerRef : undefined}
            onScroll={hasSlider ? updateScrollButtons : undefined}
            className={hasSlider ? "flex gap-3 overflow-x-auto scroll-smooth no-scrollbar" : "grid grid-cols-6 gap-4"}
          >
            {films.map((film) => (
              <Link key={film.id} href={`/film/${film.id}`}>
                <FilmCard film={film} />
              </Link>
            ))}
          </div>

          {hasSlider && canScrollLeft && (
            <button
              onClick={handleScrollLeft}
              className="absolute cursor-pointer top-1/2 -left-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-zinc-600 shadow-md dark:bg-zinc-800 dark:text-zinc-300"
            >
              <ChevronLeftIcon />
            </button>
          )}
          {hasSlider && canScrollRight && (
            <button
              onClick={handleScrollRight}
              className="absolute cursor-pointer top-1/2 -right-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-zinc-600 shadow-md dark:bg-zinc-800 dark:text-zinc-300"
            >
              <ChevronRightIcon />
            </button>
          )}
        </div>
      )}

      {lazyLoad ? (
        hasMoreData && <div ref={sentinelRef} className="h-10" />
      ) : (
        hasMoreButton && (
          <p onClick={() => !isLoading && onMoreClick?.()} className="cursor-pointer mt-2 text-right text-sm text-zinc-500 font-medium dark:text-zinc-400">
            More
          </p>
        )
      )}
    </section>
  );
}
