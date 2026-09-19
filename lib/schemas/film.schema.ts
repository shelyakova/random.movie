import z from "zod";
import { TmdbMediaType } from "../types";

const positiveInteger = () =>
  z
    .number("validation.numberInvalid")
    .int("validation.wholeNumberRequired")
    .positive("validation.positiveNumberRequired");

export const filmSchema = z.object({
  name: z.string("validation.nameRequired").trim().min(1, "validation.nameRequired"),
  categoryIds: z.array(z.number()).optional(),
  seasons: positiveInteger().nullable().optional(),
  episodes: positiveInteger().nullable().optional(),
  duration: positiveInteger().nullable().optional(),
  description: z.string().nullable().optional(),
  year: z
    .number("validation.numberInvalid")
    .int("validation.wholeNumberRequired")
    .nullable()
    .optional(),
  mark: z
    .number("validation.numberInvalid")
    .min(1, "validation.markRange")
    .max(10, "validation.markRange")
    .nullable()
    .optional(),
  link: z.string("validation.linkRequired").trim().min(1, "validation.linkRequired"),
  isWatched: z.boolean().optional(),
  newSeason: z.string().nullable(),
  latestEpisode: z.string().nullable(),
  tmdbId: z.number().optional(),
  tmdbType: z.nativeEnum(TmdbMediaType).optional(),
});

export const editFilmSchema = filmSchema.partial();

export type FilmSchema = z.infer<typeof filmSchema>;
export type EditFilmSchema = z.infer<typeof editFilmSchema>;
