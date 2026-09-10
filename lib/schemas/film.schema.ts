import z from "zod";

export const filmSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    categoryIds: z.array(z.number()).optional(),
    seasons: z.number().int().positive().optional(),
    episodes: z.number().int().positive().optional(),
    duration: z.number().int().positive().optional(),
    description: z.string().optional(),
    year: z.number().int().optional(),
    mark: z.number().min(1).max(10).optional(),
    link: z.string().trim().min(1, "Link is required"),
    isWatched: z.boolean().optional(),
});

export const editFilmSchema = filmSchema.partial();

export type FilmSchema = z.infer<typeof filmSchema>;
export type EditFilmSchema = z.infer<typeof editFilmSchema>;