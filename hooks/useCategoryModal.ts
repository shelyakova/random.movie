"use client";

import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useEditCategory,
} from "@/hooks/useCategories";
import { useSearchNavigation } from "@/hooks";
import { Category } from "@/lib/types/category";
import { ApiError } from "@/lib/api";

interface UseCategoryModalReturn {
  categories: Category[];
  isLoading: boolean;
  isSubmitDisabled: boolean;
  isAddEditDisabled: boolean;
  selectedCategory: Category | null;
  selectedFilterCategoryIds: number[];
  categoryInputValue: string;
  setCategoryInputValue: (value: string) => void;
  blockedByFilms: string[] | null;
  setBlockedByFilms: (films: string[] | null) => void;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCategory: (category: Category) => void;
  handleCreate: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  handleFilter: () => void;
}

export function useCategoryModal(onClose?: () => void): UseCategoryModalReturn {
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const editCategory = useEditCategory();

  const { currentCategoryIds, handleFilterChange } = useSearchNavigation();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedFilterCategoryIds, setSelectedFilterCategoryIds] =
    useState<number[]>(currentCategoryIds);
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [blockedByFilms, setBlockedByFilms] = useState<string[] | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleCategory = (category: Category) => {
    if (isEditMode) {
      setSelectedCategory((prev) => (prev === category ? null : category));
      setCategoryInputValue((prev) => (prev === category.name ? "" : category.name));
    } else {
      setSelectedFilterCategoryIds((prev) =>
        prev.includes(category.id)
          ? prev.filter((id) => id !== category.id)
          : [...prev, category.id],
      );
    }
  };

  const handleCreate = () => {
    createCategory.mutate(
      { name: categoryInputValue },
      { onSuccess: () => setCategoryInputValue("") },
    );
  };

  const handleEdit = () => {
    if (!selectedCategory) return;
    editCategory.mutate(
      { id: selectedCategory.id, name: categoryInputValue },
      {
        onSuccess: () => {
          setCategoryInputValue("");
          setSelectedCategory(null);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    deleteCategory.mutate(selectedCategory.id, {
      onError: (error) => {
        if (error instanceof ApiError && error.status === 403) {
          setBlockedByFilms((error.body as { films?: string[] })?.films ?? []);
        }
      },
    });
  };

  const handleFilter = () => {
    handleFilterChange(selectedFilterCategoryIds);
    onClose?.();
  };

  const isLoading =
    isCategoriesLoading ||
    createCategory.isPending ||
    deleteCategory.isPending ||
    editCategory.isPending;
  const isSubmitDisabled = isEditMode
    ? selectedCategory === null || deleteCategory.isPending
    : false;
  const isAddEditDisabled =
    categoryInputValue.length < 3 ||
    createCategory.isPending ||
    categoryInputValue === selectedCategory?.name;

  return {
    categories,
    isLoading,
    isSubmitDisabled,
    isAddEditDisabled,
    selectedCategory,
    selectedFilterCategoryIds,
    categoryInputValue,
    setCategoryInputValue,
    blockedByFilms,
    setBlockedByFilms,
    isEditMode,
    setIsEditMode,
    toggleCategory,
    handleCreate,
    handleEdit,
    handleDelete,
    handleFilter,
  };
}
