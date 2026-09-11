import { createFilm, deleteFilm, editFilm, fetchFilmById, fetchFilms } from "@/lib/api";
import { EditFilmSchema } from "@/lib/schemas/film.schema";
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
        queryKey: ['films', { isWatched, search, categoryIds, limit }],
        queryFn: ({ pageParam }) =>
            fetchFilms({ isWatched, search, categoryIds, page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === limit ? allPages.length + 1 : undefined,
    });
}

export function useGetFilmById() {
    const params = useParams<{ id: string }>();
    const filmId = Number(params.id);
    return useQuery({
        queryKey: ['films', filmId],
        queryFn: () => fetchFilmById(filmId),
    });
}

export function useCreateFilm() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFilm,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['films'] }),
    });
}

export function useSetIsWatched(filmId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ isWatched }: { isWatched: boolean }) => editFilm({ isWatched }, filmId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['films'] });
        },
    });
}

export function useEditFilm(filmId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (film: EditFilmSchema) => editFilm(film, filmId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['films'] }),
    });
}

export function useDeleteFilm(filmId: number) {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () => deleteFilm(filmId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['films'] });
            router.push('/');
        },
    });
}