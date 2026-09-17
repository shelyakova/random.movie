"use client";

import { useState } from "react";

interface UsePosterStateReturn {
  previewUrl: string | undefined;
  isMarkedForRemoval: boolean;
  setSelectedFile: (file: File | null) => void;
  setTmdbPosterUrl: (url: string | undefined) => void;
  markForRemoval: () => void;
  submitPoster: (params: {
    filmId: number;
    hasExistingPoster: boolean;
    uploadFile: (params: { filmId: number; file: File }) => Promise<unknown>;
    uploadFromUrl: (params: { filmId: number; posterUrl: string }) => Promise<unknown>;
    remove: (filmId: number) => Promise<unknown>;
  }) => Promise<void>;
}

export function usePosterState(initialPosterUrl: string | undefined): UsePosterStateReturn {
  const [selectedFile, setSelectedFileState] = useState<File | null>(null);
  const [tmdbPosterUrl, setTmdbPosterUrlState] = useState<string | undefined>(undefined);
  const [isMarkedForRemoval, setIsMarkedForRemoval] = useState(false);

  const setSelectedFile = (file: File | null) => {
    setIsMarkedForRemoval(false);
    setTmdbPosterUrlState(undefined);
    setSelectedFileState(file);
  };

  const setTmdbPosterUrl = (url: string | undefined) => {
    setIsMarkedForRemoval(false);
    setSelectedFileState(null);
    setTmdbPosterUrlState(url);
  };

  const markForRemoval = () => {
    setIsMarkedForRemoval(true);
    setSelectedFileState(null);
    setTmdbPosterUrlState(undefined);
  };

  const previewUrl = isMarkedForRemoval
    ? undefined
    : selectedFile
      ? undefined
      : (tmdbPosterUrl ?? initialPosterUrl);

  const submitPoster: UsePosterStateReturn["submitPoster"] = async ({
    filmId,
    hasExistingPoster,
    uploadFile,
    uploadFromUrl,
    remove,
  }) => {
    if (selectedFile) {
      await uploadFile({ filmId, file: selectedFile });
    } else if (tmdbPosterUrl) {
      await uploadFromUrl({ filmId, posterUrl: tmdbPosterUrl });
    } else if (isMarkedForRemoval && hasExistingPoster) {
      await remove(filmId);
    }
  };

  return {
    previewUrl,
    isMarkedForRemoval,
    setSelectedFile,
    setTmdbPosterUrl,
    markForRemoval,
    submitPoster,
  };
}
