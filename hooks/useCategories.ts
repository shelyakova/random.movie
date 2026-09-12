import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  createCategory,
  editCategory,
  deleteCategory,
} from "@/lib/api/categories";
import { useErrorStore } from "@/lib/stores/error.store";
import { ApiError } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: fetchCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all }),
    onError: () => {
      useErrorStore.getState().showError("Failed to create category");
    },
  });
}

export function useEditCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => editCategory(name, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all }),
    onError: () => {
      useErrorStore.getState().showError("Failed to edit category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories.all }),
    onError: (error) => {
      if (error instanceof ApiError && error.status === 403) {
        return;
      }
      useErrorStore.getState().showError("Failed to delete category");
    },
  });
}
