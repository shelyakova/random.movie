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
import Tooltip from "@/components/Tooltip";
import { EditIcon, DeleteIcon, CheckIcon } from "@/components/icons";
import { TagTone } from "@/lib/types";
import { useGetFilmById } from "@/hooks";
import { useDeleteFilm, useSetIsWatched } from "@/hooks/useFilms";
import { useParams } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { ACTION_GROUP, ACTION_ROW, CONTENT_ROW, DATES_ROW, DESCRIPTION_SIZE, DETAILS_COLUMN, META_SIZE, PAGE_PADDING, POSTER_COLUMN_WIDTH, POSTER_SIZE, TITLE_SIZE, TV_POSTER_VARS } from "@/lib/constants/responsive";

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

  const isNewSeasonOut = film?.newSeason ? new Date(film.newSeason) <= new Date() : false;
  const isLatestEpisodeOut = film?.latestEpisode
    ? new Date(film.latestEpisode) <= new Date()
    : false;

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

  if (!hasFilm) {
    return (
      <main className="flex flex-1 items-center justify-center pb-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <EmptyState message="Film not found" className="!bg-transparent" />
        )}
      </main>
    );
  }

  return (
    <>
      <main className={`${PAGE_PADDING} flex flex-1 flex-col ${TV_POSTER_VARS}`}>
        <h1 className={`text-foreground ${TITLE_SIZE} font-semibold wrap-break-word`}>
          {film?.name}
        </h1>

        <div className={CONTENT_ROW}>
          <FilmCard
            film={film}
            showYear
            showMark
            className={`${POSTER_SIZE} ${POSTER_COLUMN_WIDTH}`}
          />

          <div className={DETAILS_COLUMN}>
            <div className="flex flex-wrap gap-2">
              {film?.categories.map((category) => (
                <Tag key={category.id} tone={TagTone.Outline} readOnly>
                  {category.name}
                </Tag>
              ))}
            </div>

            {metaParts.length > 0 && (
              <p
                className={`border-border text-muted-foreground border-b ${META_SIZE} font-medium`}
              >
                {metaParts.join(" - ")}
              </p>
            )}

            {(film?.newSeason || film?.latestEpisode) && (
              <div className={DATES_ROW}>
                {film?.newSeason && (
                  <div>
                    <p className="text-muted-foreground pb-1 text-sm font-medium">New season</p>
                    <Tag readOnly tone={isNewSeasonOut ? TagTone.Success : TagTone.Outline}>
                      {format(new Date(film.newSeason), "dd.MM.yyyy")}
                    </Tag>
                  </div>
                )}
                {film?.latestEpisode && (
                  <div>
                    <p className="text-muted-foreground pb-1 text-sm font-medium">Latest episode</p>
                    <Tag readOnly tone={isLatestEpisodeOut ? TagTone.Success : TagTone.Outline}>
                      {format(new Date(film.latestEpisode), "dd.MM.yyyy")}
                    </Tag>
                  </div>
                )}
              </div>
            )}

            <p
              className={`text-secondary-foreground max-w-3xl ${DESCRIPTION_SIZE} leading-relaxed`}
            >
              {film?.description}
            </p>
          </div>
        </div>

        <div className={ACTION_ROW}>
          <div className={ACTION_GROUP}>
            <Tooltip content="Edit">
              <IconButton onClick={() => setIsEditModalOpen(true)} aria-label="Edit">
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip content="Delete">
              <IconButton onClick={() => setIsConfirmDeleteOpen(true)} aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            <div className="min-w-0 flex-1">
              <Button className="!mt-0" href={film?.link}>
                Go to page
              </Button>
            </div>
          </div>

          <Tooltip content={film?.isWatched ? "Mark as unwatched" : "Mark as watched"}>
            <IconButton
              onClick={handleToggleWatched}
              className={film?.isWatched ? "!bg-success-bg !text-success-foreground" : undefined}
              aria-label="Watched"
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>
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
