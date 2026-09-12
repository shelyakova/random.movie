"use client";

import {
  IconButton,
  Button,
  FilmCard,
  LoadingSpinner,
  EmptyState,
  FilmModal,
  ConfirmModal,
} from "@/components";
import Tag from "@/components/Tag";
import { EditIcon, DeleteIcon, CheckIcon } from "@/components/icons";
import { TagTone } from "@/lib/types";
import { useGetFilmById } from "@/hooks";
import { useDeleteFilm, useSetIsWatched } from "@/hooks/useFilms";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function FilmPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const params = useParams<{ id: string }>();
  const filmId = Number(params.id);

  const { data: film, isLoading: isFilmLoading } = useGetFilmById();
  const deleteFilm = useDeleteFilm(filmId);
  const setIsWatched = useSetIsWatched(filmId);

  const isLoading = isFilmLoading || setIsWatched.isPending;
  const hasFilm = !!film && Object.keys(film).length > 0;

  const metaParts = [
    film?.seasons != null ? `${film.seasons} season${film.seasons === 1 ? "" : "s"}` : null,
    film?.episodes != null ? `${film.episodes} episodes` : null,
    film?.duration != null ? `${film.duration} minutes` : null,
  ].filter((part): part is string => part !== null);

  const handleToggleWatched = () => {
    if (!film) return;
    setIsWatched.mutate({ isWatched: !film.isWatched });
  };

  const handleDelete = () => {
    deleteFilm.mutate(undefined);
  };

  if (!isLoading && !hasFilm) {
    return (
      <main className="flex flex-1 items-center justify-center pb-8">
        <EmptyState message="Film not found" className="!bg-transparent" />
      </main>
    );
  }

  return (
    <>
      <main className="flex flex-1 flex-col pb-8">
        <h1 className="mb-6 text-[40px] font-semibold text-black dark:text-white">{film?.name}</h1>

        <div className="flex gap-8">
          <FilmCard film={film} showYear showMark className="h-[548px] w-[369px]" />

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {film?.categories.map((category) => (
                <Tag key={category.id} tone={TagTone.Outline} readOnly>
                  {category.name}
                </Tag>
              ))}
            </div>

            {metaParts.length > 0 && (
              <p className="border-b border-zinc-300 pb-4 text-[20px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                {metaParts.join(" - ")}
              </p>
            )}

            <p className="text-[18px] leading-relaxed text-zinc-600 dark:text-zinc-300">
              {film?.description}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-10">
          <div className="flex w-[369px] items-center gap-2">
            <IconButton onClick={() => setIsEditModalOpen(true)}>
              <EditIcon />
            </IconButton>

            <IconButton onClick={() => setIsConfirmDeleteOpen(true)}>
              <DeleteIcon />
            </IconButton>

            <div className="flex-1">
              <Button className="!mt-0" href={film?.link}>
                Go to page
              </Button>
            </div>
          </div>

          <IconButton
            onClick={handleToggleWatched}
            className={film?.isWatched ? "!bg-[rgba(0,215,139,0.34)] !text-[#00734B]" : undefined}
          >
            <CheckIcon />
          </IconButton>
        </div>
      </main>

      {isLoading && <LoadingSpinner />}

      {isEditModalOpen && <FilmModal film={film} onClose={() => setIsEditModalOpen(false)} />}

      {isConfirmDeleteOpen && (
        <ConfirmModal
          title="Are you sure you want to delete this film?"
          message={`${film?.name}`}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmDeleteOpen(false)}
          isPending={deleteFilm.isPending}
        />
      )}
    </>
  );
}
