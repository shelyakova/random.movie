import { Film } from "@/lib/types";
import { ImagePlaceholderIcon } from "./icons";

interface FilmCardProps {
  film: Film;
}

export default function FilmCard({ film }: FilmCardProps) {
  return (
    <div className="relative h-[263px] w-[177px] shrink-0 overflow-hidden rounded-xl">
      {film.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={film.posterUrl}
          alt={film.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-zinc-200/60 dark:bg-zinc-900">
          <ImagePlaceholderIcon />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-[rgba(65,65,65,0.35)] px-3 py-2.5">
        <p className="truncate text-[16px] font-medium text-white">{film.name}</p>
      </div>
    </div>
  );
}
