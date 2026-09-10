import { Film } from "@/lib/types";
import Poster from "./Poster";

interface FilmCardProps {
  film: Film;
}

export default function FilmCard({ film }: FilmCardProps) {
  return <Poster film={film} showName className="h-[263px] w-[177px]" />;
}
