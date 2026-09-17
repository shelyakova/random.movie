"use client";

import { useForm } from "react-hook-form";
import { FilmSchema } from "@/lib/schemas/film.schema";
import { useCategories } from "@/hooks/useCategories";
import { useCreateFilm, useEditFilm, usePosterState } from "@/hooks";
import { Film, TmdbSearchResult } from "@/lib/types";
import { useRemovePoster, useUploadPoster, useUploadPosterFromUrl } from "./useFilms";
import { useRouter } from "next/navigation";
import { useTmdbAutofill } from "./useTmdbAutofill";
import { useFilmForm } from "./useFilmForm";

export interface FilmFormState {
  register: ReturnType<typeof useForm<FilmSchema>>["register"];
  errors: ReturnType<typeof useForm<FilmSchema>>["formState"]["errors"];
  name: string | undefined;
  onNameChange: (value: string) => void;
  categoryIds: number[] | undefined;
  setCategoryIds: (ids: number[]) => void;
  newSeason: string | null;
  setNewSeason: (date: string | null) => void;
  latestEpisode: string | null;
  setLatestEpisode: (date: string | null) => void;
}

interface UseFilmModalReturn {
  categories: ReturnType<typeof useCategories>["data"];
  isLoading: boolean;
  isFilled: boolean;
  form: FilmFormState;
  tmdb: {
    onSelect: (result: TmdbSearchResult) => void;
    hasLink: boolean;
    onUpdate: () => void;
  };
  poster: {
    previewUrl: string | undefined;
    onFileSelect: (file: File | null) => void;
    onRemove: () => void;
  };
  handleFormSubmit: (event: React.FormEvent) => void;
}

export function useFilmModal(film: Film | undefined, onClose?: () => void): UseFilmModalReturn {
  const isEditMode = Boolean(film);
  const router = useRouter();

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const createFilm = useCreateFilm();
  const editFilm = useEditFilm(film?.id ?? 0);
  const uploadPoster = useUploadPoster();
  const uploadPosterFromUrl = useUploadPosterFromUrl();
  const removePoster = useRemovePoster();

  const {
    register,
    handleSubmit,
    setValue,
    errors,
    name,
    categoryIds,
    link,
    newSeason,
    latestEpisode,
    tmdbId,
    tmdbType,
  } = useFilmForm(film);

  const poster = usePosterState(film?.posterUrl ?? undefined);

  const { hasTmdbLink, onTmdbSelect, onUpdateFromTmdb, isTmdbDetailsFetching } = useTmdbAutofill({
    tmdbId,
    tmdbType,
    setValue,
    onTmdbPosterReceived: poster.setTmdbPosterUrl,
  });

  const isFilled = Boolean(name?.trim()) && Boolean(link?.trim());

  const isLoading =
    isCategoriesLoading ||
    createFilm.isPending ||
    editFilm.isPending ||
    uploadPoster.isPending ||
    uploadPosterFromUrl.isPending ||
    removePoster.isPending ||
    isTmdbDetailsFetching;

  const handleRemovePoster = () => {
    poster.markForRemoval();
  };

  function nullifyUndefined<T extends Record<string, unknown>>(data: T, fields: (keyof T)[]): T {
    const result = { ...data };
    fields.forEach((field) => {
      if (result[field] === undefined) {
        result[field] = null as T[typeof field];
      }
    });
    return result;
  }

  const onSubmit = async (data: FilmSchema) => {
    const payload = nullifyUndefined(data, [
      "seasons",
      "episodes",
      "duration",
      "year",
      "mark",
      "description",
    ]);
    try {
      const newFilm = isEditMode
        ? await editFilm.mutateAsync(payload)
        : await createFilm.mutateAsync(payload);

      await poster.submitPoster({
        filmId: newFilm.id,
        hasExistingPoster: Boolean(film?.posterUrl),
        uploadFile: (p) => uploadPoster.mutateAsync(p),
        uploadFromUrl: (p) => uploadPosterFromUrl.mutateAsync(p),
        remove: (id) => removePoster.mutateAsync(id),
      });

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
    form: {
      register,
      errors,
      name,
      onNameChange: (value: string) => setValue("name", value),
      categoryIds,
      setCategoryIds: (ids: number[]) => setValue("categoryIds", ids, { shouldValidate: true }),
      newSeason,
      setNewSeason: (date: string | null) =>
        setValue("newSeason", date ?? null, { shouldValidate: true }),
      latestEpisode,
      setLatestEpisode: (date: string | null) =>
        setValue("latestEpisode", date ?? null, { shouldValidate: true }),
    },
    tmdb: {
      onSelect: onTmdbSelect,
      hasLink: hasTmdbLink,
      onUpdate: onUpdateFromTmdb,
    },
    poster: {
      previewUrl: poster.previewUrl,
      onFileSelect: poster.setSelectedFile,
      onRemove: handleRemovePoster,
    },
    handleFormSubmit,
  };
}
