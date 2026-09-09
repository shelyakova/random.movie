import { createFilm } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateFilm() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFilm,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['films'] }),
    });
}