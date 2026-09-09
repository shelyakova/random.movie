import type { Film } from "@/components";
import { authorizedFetch } from "./client";

export function fetchFilms(params: {
    search?: string;
    isWatched?: boolean;
    categoryIds?: number[];
    page?: number;
    limit?: number;
}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.isWatched !== undefined) query.set("isWatched", String(params.isWatched));
    if (params.categoryIds) params.categoryIds.forEach((id) => query.append("categoryIds", String(id)));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    return authorizedFetch<Film[]>(`/film?${query}`);
}