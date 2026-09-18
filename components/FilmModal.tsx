"use client";

import Modal from "./Modal";
import Button from "./Button";
import { useFilmModal } from "@/hooks";
import LoadingSpinner from "./LoadingSpinner";
import { Film } from "@/lib/types";
import FilmFormFields from "./FilmFormFields";
import PosterUpload from "./PosterUpload";

interface FilmModalProps {
  film?: Film;
  onClose?: () => void;
}

export default function FilmModal({ film, onClose }: FilmModalProps) {
  const isEditMode = Boolean(film);
  const { categories, isLoading, isFilled, form, tmdb, poster, handleFormSubmit } = useFilmModal(
    film,
    onClose,
  );

  return (
    <Modal
      title={isEditMode ? "Edit film" : "Add new film"}
      onRefresh={tmdb.hasLink ? tmdb.onUpdate : undefined}
      onClose={onClose}
      className="max-w-[500px]!"
      footer={
        <Button disabled={!isFilled} type="submit" form="add-film-form">
          {isEditMode ? "Edit" : "Add"}
        </Button>
      }
    >
      <form id="add-film-form" className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
        <FilmFormFields form={form} categories={categories ?? []} onTmdbSelect={tmdb.onSelect} />
        <PosterUpload
          currentPosterUrl={poster.previewUrl}
          onFileSelect={poster.onFileSelect}
          onRemove={poster.onRemove}
        />
      </form>
      {isLoading && (
        <div className="bg-overlay absolute inset-0 z-10 flex items-center justify-center rounded-3xl">
          <LoadingSpinner />
        </div>
      )}
    </Modal>
  );
}
