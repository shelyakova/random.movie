import z from "zod";
import { TmdbMediaType } from "../types";

export const filmSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  categoryIds: z.array(z.number()).optional(),
  seasons: z.number().int().positive().nullable().optional(),
  episodes: z.number().int().positive().nullable().optional(),
  duration: z.number().int().positive().nullable().optional(),
  description: z.string().nullable().optional(),
  year: z.number().int().nullable().optional(),
  mark: z.number().min(1).max(10).nullable().optional(),
  link: z.string().trim().min(1, "Link is required"),
  isWatched: z.boolean().optional(),
  newSeason: z.string().nullable(),
  latestEpisode: z.string().nullable(),
  tmdbId: z.number().optional(),
  tmdbType: z.nativeEnum(TmdbMediaType).optional(),
});

export const editFilmSchema = filmSchema.partial();

export type FilmSchema = z.infer<typeof filmSchema>;
export type EditFilmSchema = z.infer<typeof editFilmSchema>;
