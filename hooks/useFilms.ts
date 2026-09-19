"use client";

import {
  createFilm,
  deleteFilm,
  editFilm,
  fetchFilmById,
  fetchFilms,
  fetchRandomFilm,
  removePoster,
  uploadPoster,
  uploadPosterFromUrl,
} from "@/lib/api";
import { EditFilmSchema } from "@/lib/schemas/film.schema";
import { useErrorStore } from "@/lib/stores/error.store";
import { Film } from "@/lib/types";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export function useFilms(params: {
  isWatched?: boolean;
  search?: string;
  categoryIds?: number[];
  newSeasonOut?: boolean;
  hasLatestEpisode?: boolean;
  limit?: number;
}) {
  const { isWatched, search, categoryIds, newSeasonOut, hasLatestEpisode, limit = 8 } = params;

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.films.list({
      isWatched,
      search,
      categoryIds,
      newSeasonOut,
      hasLatestEpisode,
      limit,
    }),
    queryFn: ({ pageParam }) =>
      fetchFilms({
        isWatched,
        search,
        categoryIds,
        newSeasonOut,
        hasLatestEpisode,
        page: pageParam,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === limit ? allPages.length + 1 : undefined,
  });
}

export function useRandomFilm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      search,
      categoryIds,
      newSeasonOut,
      hasLatestEpisode,
    }: {
      search: string;
      categoryIds: number[];
      newSeasonOut?: boolean;
      hasLatestEpisode?: boolean;
      filterParams: string;
    }) => {
      const [film] = await Promise.all([
        fetchRandomFilm(search, categoryIds, newSeasonOut, hasLatestEpisode),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      await queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.films.detail(film.id),
        queryFn: () => fetchFilmById(film.id),
      });

      return film;
    },
    onSuccess: (film, variables) => {
      const query = variables.filterParams ? `?${variables.filterParams}` : "";
      router.push(`/film/${film.id}${query}`);
    },
    onError: () => {
      useErrorStore.getState().showError("errors.fetchRandomFilm");
    },
  });
}

export function useGetFilmById() {
  const params = useParams<{ id: string }>();
  const filmId = Number(params.id);
  return useQuery({
    queryKey: QUERY_KEYS.films.detail(filmId),
    queryFn: () => fetchFilmById(filmId),
  });
}

export function useCreateFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFilm,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.films.all }),
    onError: () => {
      useErrorStore.getState().showError("errors.createFilm");
    },
  });
}

export function useUploadPoster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ filmId, file }: { filmId: number; file: File }) => uploadPoster(filmId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.films.all }),
    onError: () => {
      useErrorStore.getState().showError("errors.uploadPoster");
    },
  });
}

export function useUploadPosterFromUrl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ filmId, posterUrl }: { filmId: number; posterUrl: string }) =>
      uploadPosterFromUrl(filmId, posterUrl),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.films.all }),
    onError: () => {
      useErrorStore.getState().showError("errors.uploadPoster");
    },
  });
}

export function useRemovePoster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (filmId: number) => removePoster(filmId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.films.all }),
    onError: () => {
      useErrorStore.getState().showError("errors.removePoster");
    },
  });
}

export function useSetIsWatched(filmId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isWatched }: { isWatched: boolean }) => editFilm({ isWatched }, filmId),

    onMutate: async ({ isWatched }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.films.detail(filmId) });

      const previousFilm = queryClient.getQueryData<Film>(QUERY_KEYS.films.detail(filmId));

      queryClient.setQueryData<Film>(QUERY_KEYS.films.detail(filmId), (old) =>
        old ? { ...old, isWatched } : old,
      );

      return { previousFilm };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousFilm) {
        queryClient.setQueryData(QUERY_KEYS.films.detail(filmId), context.previousFilm);
      }
      useErrorStore.getState().showError("errors.updateWatchedStatus");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.films.all });
    },
  });
}

export function useEditFilm(filmId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (film: EditFilmSchema) => editFilm(film, filmId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.films.all }),
    onError: () => {
      useErrorStore.getState().showError("errors.editFilm");
    },
  });
}

export function useDeleteFilm(filmId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteFilm(filmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.films.all });
      router.push("/");
    },
    onError: () => {
      useErrorStore.getState().showError("errors.deleteFilm");
    },
  });
}
