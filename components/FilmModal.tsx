"use client";

import Modal from "./Modal";
import Button from "./Button";
import { useFilmModal } from "@/hooks";
import LoadingSpinner from "./LoadingSpinner";
import { Film } from "@/lib/types";
import FilmFormFields from "./FilmFormFields";

interface FilmModalProps {
  film?: Film;
  onClose?: () => void;
}

export default function FilmModal({ film, onClose }: FilmModalProps) {
  const isEditMode = Boolean(film);
  const {
    categories,
    isLoading,
    isFilled,
    register,
    errors,
    categoryIds,
    setCategoryIds,
    handleFormSubmit,
  } = useFilmModal(film, onClose);

  return (
    <Modal
      title={isEditMode ? "Edit film" : "Add new film"}
      onClose={onClose}
      className="max-w-[500px]!"
      footer={
        <Button disabled={!isFilled} type="submit" form="add-film-form">
          {isEditMode ? "Edit" : "Add"}
        </Button>
      }
    >
      <form id="add-film-form" className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
        <FilmFormFields
          register={register}
          errors={errors}
          categories={categories ?? []}
          categoryIds={categoryIds}
          onCategoryIdsChange={setCategoryIds}
        />
      </form>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60 dark:bg-black/60">
          <LoadingSpinner />
        </div>
      )}
    </Modal>
  );
}
