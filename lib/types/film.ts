import { Category } from "./category";

export interface Film {
  id: number;
  createdAt: string;
  name: string;
  description: string | null;
  year: number | null;
  link: string;
  posterUrl: string | null;
  seasons: number | null;
  episodes: number | null;
  duration: number | null;
  isWatched: boolean;
  mark: number | null;
  userId: number;
  categories: Category[];
}
