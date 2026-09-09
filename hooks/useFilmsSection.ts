import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFilms } from '@/lib/api';

export function useFilmsSection(isWatched: boolean, search: string) {
    return useInfiniteQuery({
        queryKey: ['films', { isWatched, search }],
        queryFn: ({ pageParam }) =>
            fetchFilms({ isWatched, search, page: pageParam, limit: 8 }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === 8 ? allPages.length + 1 : undefined,
    });
}