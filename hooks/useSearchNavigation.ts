"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface UseSearchNavigationReturn {
  currentSearch: string;
  currentCategoryIds: number[];
  currentNewSeasonOut: boolean;
  currentHasLatestEpisode: boolean;
  handleSearchChange: (value: string) => void;
  handleFilterChange: (
    categoryIds: number[],
    newSeasonOut: boolean,
    hasLatestEpisode: boolean,
  ) => void;
  buildParams: () => URLSearchParams;
}

export function useSearchNavigation(): UseSearchNavigationReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategoryIds = searchParams.getAll("categoryIds").map(Number);
  const currentNewSeasonOut = searchParams.get("newSeasonOut") === "true";
  const currentHasLatestEpisode = searchParams.get("hasLatestEpisode") === "true";

  const buildParams = () => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    currentCategoryIds.forEach((id) => params.append("categoryIds", String(id)));
    if (currentNewSeasonOut) params.set("newSeasonOut", "true");
    if (currentHasLatestEpisode) params.set("hasLatestEpisode", "true");
    return params;
  };

  const handleSearchChange = (value: string) => {
    const params = buildParams();
    if (value) params.set("search", value);
    else params.delete("search");
    router.push(`/?${params}`);
  };

  const handleFilterChange = (
    categoryIds: number[],
    newSeasonOut: boolean,
    hasLatestEpisode: boolean,
  ) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    categoryIds.forEach((id) => params.append("categoryIds", String(id)));
    if (newSeasonOut) params.set("newSeasonOut", "true");
    if (hasLatestEpisode) params.set("hasLatestEpisode", "true");
    router.push(`/?${params}`);
  };

  return {
    currentSearch,
    currentCategoryIds,
    currentNewSeasonOut,
    currentHasLatestEpisode,
    handleSearchChange,
    handleFilterChange,
    buildParams,
  };
}
