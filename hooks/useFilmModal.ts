"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { filmSchema, FilmSchema } from "@/lib/schemas/film.schema";
import { useCategories } from "@/hooks/useCategories";
import { useCreateFilm, useEditFilm } from "@/hooks";
import { Film } from "@/lib/types";

interface UseFilmModalReturn {
  categories: ReturnType<typeof useCategories>["data"];
  isLoading: boolean;
  isFilled: boolean;
  register: ReturnType<typeof useForm<FilmSchema>>["register"];
  errors: ReturnType<typeof useForm<FilmSchema>>["formState"]["errors"];
  categoryIds: number[] | undefined;
  setCategoryIds: (ids: number[]) => void;
  handleFormSubmit: (event: React.FormEvent) => void;
}

export function useFilmModal(film: Film | undefined, onClose?: () => void): UseFilmModalReturn {
  const isEditMode = Boolean(film);

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const createFilm = useCreateFilm();
  const editFilm = useEditFilm(film?.id ?? 0);

  const isLoading = isCategoriesLoading || createFilm.isPending || editFilm.isPending;

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

  const [name, categoryIds, link] = watch(["name", "categoryIds", "link"]);
  const isFilled = Boolean(name?.trim()) && Boolean(link?.trim());

  const onSubmit = (data: FilmSchema) => {
    if (isEditMode) {
      editFilm.mutate(data, { onSuccess: () => onClose?.() });
    } else {
      createFilm.mutate(data, { onSuccess: () => onClose?.() });
    }
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
    handleFormSubmit,
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
    description: film.description ?? undefined,
    year: film.year ?? undefined,
    mark: film.mark ?? undefined,
  };
}
