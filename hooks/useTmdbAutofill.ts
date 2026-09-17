"use client";

import { FilmSchema } from "@/lib/schemas/film.schema";
import { TmdbMediaType, TmdbSearchResult } from "@/lib/types";
import { UseFormSetValue } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { fetchTmdbDetails } from "@/lib/api";
import { useState } from "react";

interface UseTmdbAutofillReturn {
  hasTmdbLink: boolean;
  onTmdbSelect: (result: TmdbSearchResult) => void;
  onUpdateFromTmdb: () => void;
  isTmdbDetailsFetching: boolean;
}

export function useTmdbAutofill(params: {
  tmdbId: number | undefined;
  tmdbType: TmdbMediaType | undefined;
  setValue: UseFormSetValue<FilmSchema>;
  onTmdbPosterReceived: (url: string) => void;
}): UseTmdbAutofillReturn {
  const { tmdbId, tmdbType, setValue, onTmdbPosterReceived } = params;

  const detailsMutation = useMutation({
    mutationFn: ({ type, id }: { type: TmdbMediaType; id: number }) => fetchTmdbDetails(type, id),
    onSuccess: (details) => {
      setValue("description", details.description ?? null);
      setValue("year", details.year ?? undefined);
      setValue("duration", details.duration ?? undefined);
      setValue("seasons", details.seasons ?? undefined);
      setValue("episodes", details.episodes ?? undefined);
      setValue("newSeason", details.newSeason ?? null);
      setValue("latestEpisode", details.latestEpisode ?? null);
      setValue("mark", details.mark ?? undefined);

      if (details.posterUrl) {
        onTmdbPosterReceived(details.posterUrl);
      }
    },
  });

  const handleTmdbSelect = (result: TmdbSearchResult) => {
    setValue("name", result.name);
    setValue("tmdbId", result.tmdbId);
    setValue("tmdbType", result.type);
    detailsMutation.mutate({ type: result.type, id: result.tmdbId });
  };

  const handleUpdateFromTmdb = () => {
    if (tmdbId && tmdbType) {
      detailsMutation.mutate({ type: tmdbType, id: tmdbId });
    }
  };

  return {
    hasTmdbLink: Boolean(tmdbId && tmdbType),
    onTmdbSelect: handleTmdbSelect,
    onUpdateFromTmdb: handleUpdateFromTmdb,
    isTmdbDetailsFetching: detailsMutation.isPending,
  };
}
