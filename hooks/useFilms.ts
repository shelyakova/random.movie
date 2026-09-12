"use client";

import {
  createFilm,
  deleteFilm,
  editFilm,
  fetchFilmById,
  fetchFilms,
  fetchRandomFilm,
} from "@/lib/api";
import { EditFilmSchema } from "@/lib/schemas/film.schema";
import { useErrorStore } from "@/lib/stores/error.store";
import { Film } from "@/lib/types";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export function useFilms(params: {
  isWatched?: boolean;
  search: string;
  categoryIds: number[];
  limit?: number;
}) {
  const { isWatched, search, categoryIds, limit = 8 } = params;

  return useInfiniteQuery({
    queryKey: ["films", { isWatched, search, categoryIds, limit }],
    queryFn: ({ pageParam }) =>
      fetchFilms({ isWatched, search, categoryIds, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === limit ? allPages.length + 1 : undefined,
  });
}

export function useRandomFilm() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ search, categoryIds }: { search: string; categoryIds: number[] }) =>
      fetchRandomFilm(search, categoryIds),
    onSuccess: (film) => {
      router.push(`/film/${film.id}`);
    },
    onError: () => {
      useErrorStore.getState().showError("Failed to fetch random film");
    },
  });
}

export function useGetFilmById() {
  const params = useParams<{ id: string }>();
  const filmId = Number(params.id);
  return useQuery({
    queryKey: ["films", filmId],
    queryFn: () => fetchFilmById(filmId),
  });
}

export function useCreateFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFilm,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["films"] }),
    onError: () => {
      useErrorStore.getState().showError("Failed to create film");
    },
  });
}

export function useSetIsWatched(filmId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isWatched }: { isWatched: boolean }) => editFilm({ isWatched }, filmId),

    onMutate: async ({ isWatched }) => {
      await queryClient.cancelQueries({ queryKey: ["films", filmId] });

      const previousFilm = queryClient.getQueryData<Film>(["films", filmId]);

      queryClient.setQueryData<Film>(["films", filmId], (old) =>
        old ? { ...old, isWatched } : old,
      );

      return { previousFilm };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousFilm) {
        queryClient.setQueryData(["films", filmId], context.previousFilm);
      }
      useErrorStore.getState().showError("Failed to set isWatched for a film");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["films"] });
    },
  });
}

export function useEditFilm(filmId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (film: EditFilmSchema) => editFilm(film, filmId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["films"] }),
    onError: () => {
      useErrorStore.getState().showError("Failed to edit film");
    },
  });
}

export function useDeleteFilm(filmId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteFilm(filmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["films"] });
      router.push("/");
    },
    onError: () => {
      useErrorStore.getState().showError("Failed to delete film");
    },
  });
}
