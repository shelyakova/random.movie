"use client";

import { filmSchema, FilmSchema } from "@/lib/schemas/film.schema";
import { Film, TmdbMediaType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

interface UseFilmFormReturn {
  register: ReturnType<typeof useForm<FilmSchema>>["register"];
  handleSubmit: ReturnType<typeof useForm<FilmSchema>>["handleSubmit"];
  setValue: ReturnType<typeof useForm<FilmSchema>>["setValue"];
  errors: ReturnType<typeof useForm<FilmSchema>>["formState"]["errors"];
  name: string | undefined;
  categoryIds: number[] | undefined;
  link: string | undefined;
  newSeason: string | null;
  latestEpisode: string | null;
  tmdbId: number | undefined;
  tmdbType: TmdbMediaType | undefined;
}

export function useFilmForm(film: Film | undefined): UseFilmFormReturn {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FilmSchema>({
    resolver: zodResolver(filmSchema),
    defaultValues: getFilmDefaultValues(film),
  });
  
  useEffect(() => {
    if (film) reset(getFilmDefaultValues(film));
  }, [film, reset]);

  const [name, categoryIds, link, newSeason, latestEpisode, tmdbId, tmdbType] = watch([
    "name",
    "categoryIds",
    "link",
    "newSeason",
    "latestEpisode",
    "tmdbId",
    "tmdbType",
  ]);

  return {
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
  };
}

function getFilmDefaultValues(film?: Film): Partial<FilmSchema> | undefined {
  if (!film) return { newSeason: null, latestEpisode: null };

  return {
    name: film.name,
    link: film.link,
    categoryIds: film.categories.map((c) => c.id),
    seasons: film.seasons ?? undefined,
    episodes: film.episodes ?? undefined,
    duration: film.duration ?? undefined,
    newSeason: film.newSeason ? film.newSeason.split("T")[0] : null,
    latestEpisode: film.latestEpisode ? film.latestEpisode.split("T")[0] : null,
    description: film.description ?? undefined,
    year: film.year ?? undefined,
    mark: film.mark ?? undefined,
    tmdbId: film.tmdbId ?? undefined,
    tmdbType: film.tmdbType ?? undefined,
  };
}
