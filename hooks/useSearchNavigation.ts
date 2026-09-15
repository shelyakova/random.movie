"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useSearchNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = pathname === "/" ? (searchParams.get("search") ?? "") : "";
  const currentCategoryIds = pathname === "/" ? searchParams.getAll("categoryIds").map(Number) : [];
  const currentNewSeasonOut =
    pathname === "/" ? searchParams.get("newSeasonOut") === "true" : false;
  const currentHasLatestEpisode =
    pathname === "/" ? searchParams.get("hasLatestEpisode") === "true" : false;

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
  };
}
