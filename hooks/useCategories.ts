import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createCategory, editCategory, deleteCategory } from '@/lib/api/categories';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });
}

export function useEditCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) => editCategory(name, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });
}