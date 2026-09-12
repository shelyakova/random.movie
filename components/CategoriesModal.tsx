"use client";

import Modal from "./Modal";
import Tag from "./Tag";
import Button from "./Button";
import FormInput from "./FormInput";
import LoadingSpinner from "./LoadingSpinner";
import { IconButton } from "./IconButton";
import { PlusIcon, EditIcon } from "./icons";
import { TagRadius, Tone } from "@/lib/types";
import { useCategoryModal } from "@/hooks";
import ConfirmModal from "./ConfirmModal";

interface CategoriesModalProps {
  onClose?: () => void;
}

export default function CategoriesModal({ onClose }: CategoriesModalProps) {
  const {
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
  } = useCategoryModal(onClose);

  return (
    <Modal
      title={isEditMode ? "Edit categories" : "Filter by categories"}
      onEdit={() => setIsEditMode((prev) => !prev)}
      isEdit={isEditMode}
      onClose={onClose}
      className="h-[80vh]"
      footer={
        <div className="flex flex-col gap-4">
          {isEditMode && (
            <div className="flex items-center gap-3">
              <FormInput
                placeholder="Add new category"
                className="flex-1"
                value={categoryInputValue}
                onChange={(e) => setCategoryInputValue(e.target.value)}
              />
              <IconButton
                disabled={isAddEditDisabled}
                tone={Tone.Accent}
                onClick={selectedCategory ? handleEdit : handleCreate}
              >
                {selectedCategory ? <EditIcon /> : <PlusIcon />}
              </IconButton>
            </div>
          )}
          <Button disabled={isSubmitDisabled} onClick={isEditMode ? handleDelete : handleFilter}>
            {isEditMode ? "Delete" : "Filter"}
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
              selected={
                isEditMode
                  ? selectedCategory?.id === category.id
                  : selectedFilterCategoryIds.includes(category.id)
              }
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
            message={blockedByFilms.join(", ")}
            onConfirm={() => setBlockedByFilms(null)}
          />
        )}
      </>
    </Modal>
  );
}
