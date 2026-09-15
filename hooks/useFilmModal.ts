"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { filmSchema, FilmSchema } from "@/lib/schemas/film.schema";
import { useCategories } from "@/hooks/useCategories";
import { useCreateFilm, useEditFilm } from "@/hooks";
import { Film } from "@/lib/types";
import { useUploadPoster } from "./useFilms";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseFilmModalReturn {
  categories: ReturnType<typeof useCategories>["data"];
  isLoading: boolean;
  isFilled: boolean;
  register: ReturnType<typeof useForm<FilmSchema>>["register"];
  errors: ReturnType<typeof useForm<FilmSchema>>["formState"]["errors"];
  categoryIds: number[] | undefined;
  setCategoryIds: (ids: number[]) => void;
  newSeason: string | undefined;
  setNewSeason: (date: string | undefined) => void;
  latestEpisode: string | undefined;
  setLatestEpisode: (date: string | undefined) => void;
  handleFormSubmit: (event: React.FormEvent) => void;
  setSelectedFile: (file: File | null) => void;
}

export function useFilmModal(film: Film | undefined, onClose?: () => void): UseFilmModalReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isEditMode = Boolean(film);

  const router = useRouter();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const createFilm = useCreateFilm();
  const editFilm = useEditFilm(film?.id ?? 0);
  const uploadPoster = useUploadPoster();

  const isLoading =
    isCategoriesLoading || createFilm.isPending || editFilm.isPending || uploadPoster.isPending;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FilmSchema>({
    resolver: zodResolver(filmSchema),
    defaultValues: getFilmDefaultValues(film),
  });

  const [name, categoryIds, link, newSeason, latestEpisode] = watch([
    "name",
    "categoryIds",
    "link",
    "newSeason",
    "latestEpisode",
  ]);
  const isFilled = Boolean(name?.trim()) && Boolean(link?.trim());

  const onSubmit = async (data: FilmSchema) => {
    try {
      const newFilm = isEditMode
        ? await editFilm.mutateAsync(data)
        : await createFilm.mutateAsync(data);

      if (selectedFile) {
        await uploadPoster.mutateAsync({ filmId: newFilm.id, file: selectedFile });
      }

      onClose?.();

      if (!isEditMode) {
        router.push(`/film/${newFilm.id}`);
      }
    } catch {}
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    if (!isFilled) {
      event.preventDefault();
      return;
    }
    handleSubmit(onSubmit)(event);
  };

  return {
    categories,
    isLoading,
    isFilled,
    register,
    errors,
    categoryIds,
    setCategoryIds: (ids: number[]) => setValue("categoryIds", ids, { shouldValidate: true }),
    newSeason,
    setNewSeason: (date: string | undefined) =>
      setValue("newSeason", date, { shouldValidate: true }),
    latestEpisode,
    setLatestEpisode: (date: string | undefined) =>
      setValue("latestEpisode", date, { shouldValidate: true }),
    handleFormSubmit,
    setSelectedFile,
  };
}

function getFilmDefaultValues(film?: Film): Partial<FilmSchema> | undefined {
  if (!film) return undefined;

  return {
    name: film.name,
    link: film.link,
    categoryIds: film.categories.map((c) => c.id),
    seasons: film.seasons ?? undefined,
    episodes: film.episodes ?? undefined,
    duration: film.duration ?? undefined,
    newSeason: film.newSeason ? film.newSeason.split("T")[0] : undefined,
    latestEpisode: film.latestEpisode ? film.latestEpisode.split("T")[0] : undefined,
    description: film.description ?? undefined,
    year: film.year ?? undefined,
    mark: film.mark ?? undefined,
  };
}
