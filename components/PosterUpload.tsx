"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AddPosterIcon, DeleteIcon } from "./icons";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface PosterUploadProps {
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  currentPosterUrl?: string;
  className?: string;
}

function getFileNameFromUrl(url: string) {
  try {
    const { pathname } = new URL(url);
    return decodeURIComponent(pathname.split("/").pop() || url);
  } catch {
    return url.split("/").pop() || url;
  }
}

export default function PosterUpload({
  onFileSelect,
  onRemove,
  currentPosterUrl,
  className,
}: PosterUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [sizeError, setSizeError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const displayUrl = previewUrl ?? currentPosterUrl;
  const fileName =
    selectedFile?.name ?? (currentPosterUrl ? getFileNameFromUrl(currentPosterUrl) : undefined);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSizeError("File is too large. Maximum size is 5MB.");
      event.target.value = "";
      return;
    }

    setSizeError(null);
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setSizeError(null);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/png, image/jpeg, image/webp"
      className="hidden"
      onChange={handleChange}
    />
  );

  if (displayUrl) {
    return (
      <>
        <div
          className={`relative flex h-32 items-center gap-3 overflow-hidden rounded-xl border border-zinc-300 px-3 dark:border-zinc-700 ${className ?? ""}`}
        >
          {fileInput}

          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt="Poster thumbnail"
              className="h-24 w-24 shrink-0 rounded-lg object-cover"
            />
            <span className="min-w-0 flex-1 truncate text-left text-sm text-black dark:text-white">
              {fileName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove poster"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-[#37C6F3] dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <DeleteIcon />
          </button>
        </div>
        {sizeError && <p className="text-center text-xs text-red-500">{sizeError}</p>}
      </>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Add poster"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700 ${className ?? ""}`}
    >
      {fileInput}

      <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
        <AddPosterIcon />
        <span className="text-sm">Add poster</span>
        {sizeError && <p className="text-center text-xs text-red-500">{sizeError}</p>}
      </div>
    </div>
  );
}
