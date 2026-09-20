export const SLIDER_LIMIT = 16;
export const EXPANDED_LIMIT = 18;
export const SEARCH_LIMIT = 12;

export const POSTER_COLUMN_WIDTH = "md:w-72 lg:w-80 xl:w-[369px] tv:w-(--poster-w)";
const TV_POSTER_HEIGHT_VAR = "tv:[--poster-h:max(8rem,calc(100dvh_-_13.5rem))]";
const TV_POSTER_WIDTH_VAR = "tv:[--poster-w:calc(var(--poster-h)_*_369_/_548)]";
export const TV_POSTER_VARS = `${TV_POSTER_HEIGHT_VAR} ${TV_POSTER_WIDTH_VAR}`;
export const POSTER_SIZE = "tv:h-(--poster-h) aspect-[369/548] w-full md:self-start";

export const PAGE_PADDING = "tv:pb-4 pb-8";
export const CONTENT_ROW = "tv:gap-5 flex flex-col gap-6 md:flex-row md:gap-8";
export const DETAILS_COLUMN =
  "tv:max-h-(--poster-h) tv:gap-3 tv:overflow-y-auto themed-scrollbar flex min-w-0 flex-1 flex-col gap-6 md:gap-8";
  export const DATES_ROW = "flex flex-col gap-4 md:flex-row md:flex-wrap";
  export const ACTION_ROW = "tv:pt-4 mt-auto flex items-center gap-2 pt-8 md:justify-between md:pt-10";
  export const ACTION_GROUP = `contents md:flex md:items-center md:gap-2 ${POSTER_COLUMN_WIDTH}`;

export const TITLE_SIZE = "tv:mb-3 tv:text-xl mb-6 text-2xl sm:text-3xl md:text-[40px]";
export const META_SIZE = "tv:pb-2 tv:text-base pb-4 text-[20px]";
export const DESCRIPTION_SIZE = "tv:text-base text-[18px]";

export const SLIDER_CARD_CLASS = "aspect-[177/263] w-36 sm:w-[177px] tv:w-36";
export const GRID_CARD_CLASS = "aspect-[177/263] w-full";

export const GRID_CLASS =
  "grid grid-cols-[repeat(auto-fill,minmax(min(150px,calc(50%_-_8px)),1fr))] gap-4";
