import { useState } from "react";
import Modal from "./Modal";
import Tag, { TagRadius } from "./Tag";
import Button from "./Button";
import FormInput from "./FormInput";
import LoadingSpinner from "./LoadingSpinner";
import { IconButton, Tone } from "./IconButton";
import { PlusIcon, EditIcon } from "./icons";
import { useCategories, useCreateCategory, useDeleteCategory, useEditCategory } from "@/hooks/useCategories";
import { Category } from "@/lib/types/category";
import { ApiError } from "@/lib/api";
import ConfirmModal from "./ConfirmModal";

interface CategoriesModalProps {
  onEdit?: () => void;
  onClose?: () => void;
}

export default function CategoriesModal({ onEdit, onClose }: CategoriesModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [blockedByFilms, setBlockedByFilms] = useState<string[] | null>(null);

  const toggleCategory = (category: Category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
    setCategoryInputValue((prev) => (prev === category.name ? "" : category.name));
  };

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const editCategory = useEditCategory();

  const isLoading = isCategoriesLoading || createCategory.isPending || deleteCategory.isPending || editCategory.isPending;

  const handleCreate = () => {
    createCategory.mutate(
      categoryInputValue,
      { onSuccess: () => setCategoryInputValue("") },
    );
  };

  const handleEdit = () => {
    selectedCategory && editCategory.mutate(
      { id: selectedCategory.id, name: categoryInputValue },
      {
        onSuccess: () => {
          setCategoryInputValue("");
          setSelectedCategory(null);
        }
      },
    );
  };

  const handleDelete = () => {
    selectedCategory && deleteCategory.mutate(selectedCategory.id, {
      onError: (error) => {
        if (error instanceof ApiError && error.status === 403) {
          const films = (error.body as { films?: string[] })?.films ?? [];
          setBlockedByFilms(films);
        }
      },
    });
  };

  return (
    <Modal
      title="Edit categories"
      onEdit={onEdit}
      onClose={onClose}
      className="h-[80vh]"
      footer={
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <FormInput
              placeholder="Add new category"
              className="flex-1"
              value={categoryInputValue}
              onChange={(e) => setCategoryInputValue(e.target.value)}
            />
            <IconButton
              disabled={categoryInputValue.length < 3 || createCategory.isPending || categoryInputValue === selectedCategory?.name}
              tone={Tone.Accent}
              onClick={selectedCategory ? handleEdit : handleCreate}
            >
              {selectedCategory ? <EditIcon /> : <PlusIcon />}
            </IconButton>
          </div>

          <Button
            disabled={selectedCategory === null || deleteCategory.isPending}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      }
    >
      <>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pick categories:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Tag
              key={category.id}
              radius={category.name.length > 20 ? TagRadius.Lg : TagRadius.Full}
              selected={selectedCategory?.id === category.id}
              onClick={() => toggleCategory(category)}
            >
              {category.name}
            </Tag>
          ))}
        </div>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60 dark:bg-black/60">
            <LoadingSpinner />
          </div>
        )}
        {blockedByFilms && (
          <ConfirmModal
            title="You have a film(s) in this category. Please delete this category from the film(s) first."
            message={blockedByFilms.join(', ')}
            onConfirm={() => setBlockedByFilms(null)}
          />
        )}
      </>
    </Modal>
  );
}
