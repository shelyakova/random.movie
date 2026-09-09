import FilmCard from "./FilmCard";
import EmptyState from "./EmptyState";
import { ChevronRightIcon } from "./icons";
import { Film } from "@/lib/types";

interface FilmSectionProps {
  title: string;
  films: Film[];
  onMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function FilmSection({ title, films, onMore, hasMore, isLoading }: FilmSectionProps) {
  return (
    <section className="w-full">
      <h2 className='mb-[26px] text-[20px] font-medium text-black dark:text-white'>
        {title}
      </h2>

      {films.length === 0 ? (
        <EmptyState message="No films found" />
      ) : (
        <div className="relative">
          <div className="flex gap-3 overflow-hidden">
            {films.map((film) => (
              <FilmCard key={film.name} film={film} />
            ))}
          </div>

          <div className="absolute top-1/2 right-0 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-zinc-600 shadow-md dark:bg-zinc-800 dark:text-zinc-300">
            <ChevronRightIcon />
          </div>
        </div>
      )}

      {hasMore && (
        <p onClick={() => !isLoading && onMore()} className="mt-2 text-right text-sm text-zinc-500 font-medium dark:text-zinc-400">
          More
        </p>
      )}

    </section>
  );
}
