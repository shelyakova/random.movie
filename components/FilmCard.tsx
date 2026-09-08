export interface Film {
  name: string;
  poster: string;
}

interface FilmCardProps {
  film: Film;
}

export default function FilmCard({ film }: FilmCardProps) {
  return (
    <div className="relative h-[263px] w-[177px] shrink-0 overflow-hidden rounded-xl bg-zinc-300 dark:bg-zinc-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={film.poster}
        alt={film.name}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-[rgba(65,65,65,0.56)] px-3 py-2.5">
        <p className="truncate text-[16px] font-medium text-white">{film.name}</p>
      </div>
    </div>
  );
}
