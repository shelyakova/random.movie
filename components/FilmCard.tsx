import { Film } from "@/lib/types";
import { ImagePlaceholderIcon } from "./icons";
import Tag, { TagTone } from "./Tag";

interface FilmCardProps {
  film?: Film;
  className?: string;
  showYear?: boolean;
  showMark?: boolean;
  showName?: boolean;
}

export default function FilmCard({
  film,
  className,
  showYear = false,
  showMark = false,
  showName = false,
}: FilmCardProps) {
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

      {showName && (
        <div className="absolute inset-x-0 bottom-0 bg-[rgba(65,65,65,0.35)] px-3 py-2.5">
          <p className="truncate text-[16px] font-medium text-white">{film?.name}</p>
        </div>
      )}
    </div>
  );
}
