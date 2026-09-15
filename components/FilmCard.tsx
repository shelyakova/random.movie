import { Film, TagTone } from "@/lib/types";
import { BellIcon, CalendarIcon, ImagePlaceholderIcon } from "./icons";
import Tag from "./Tag";

interface FilmCardProps {
  film?: Film;
  className?: string;
  showYear?: boolean;
  showMark?: boolean;
  showName?: boolean;
  showDateIcons?: boolean;
}

export default function FilmCard({
  film,
  className,
  showYear = false,
  showMark = false,
  showName = false,
  showDateIcons = false,
}: FilmCardProps) {
  const isNewSeasonOut = film?.newSeason ? new Date(film.newSeason) <= new Date() : false;
  const isLatestEpisodeOut = film?.latestEpisode
    ? new Date(film.latestEpisode) <= new Date()
    : false;

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-xl ${className ?? ""}`}>
      {film?.posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={film?.posterUrl} alt={film?.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-zinc-200/60 dark:bg-zinc-900">
          <ImagePlaceholderIcon />
        </div>
      )}

      {showYear && film?.year !== null && (
        <Tag tone={TagTone.Info} className="absolute top-3 left-3" readOnly>
          {film?.year}
        </Tag>
      )}

      {showMark && film?.mark !== null && (
        <Tag tone={TagTone.Rating} className="absolute right-3 bottom-3" readOnly>
          {film?.mark}
        </Tag>
      )}

      {showDateIcons && (
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNewSeasonOut && (
            <Tag tone={TagTone.Rating} className="!px-1 !py-1 opacity-80" readOnly>
              <BellIcon />
            </Tag>
          )}
          {isLatestEpisodeOut && (
            <Tag tone={TagTone.Success} className="!px-1 !py-1" readOnly>
              <CalendarIcon />
            </Tag>
          )}
        </div>
      )}

      {showName && (
        <div className="absolute inset-x-0 bottom-0 bg-[rgba(65,65,65,0.35)] px-3 py-2.5">
          <p className="truncate text-[16px] font-medium text-white">{film?.name}</p>
        </div>
      )}
    </div>
  );
}
