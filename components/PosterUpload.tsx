"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AddPosterIcon, DeleteIcon } from "./icons";
import { useTranslations } from "next-intl";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

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
  const t = useTranslations("poster");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [hasSizeError, setHasSizeError] = useState(false);

  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const updateSelection = (file: File | null) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = file ? URL.createObjectURL(file) : null;
    setSelectedFile(file);
    setPreviewUrl(objectUrlRef.current ?? undefined);
  };

  const sizeErrorMessage = t("tooLarge", { maxSizeMb: MAX_FILE_SIZE_MB });
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
      setHasSizeError(true);
      event.target.value = "";
      return;
    }

    setHasSizeError(false);
    updateSelection(file);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setHasSizeError(false);
    updateSelection(null);
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
          className={`border-border relative flex h-32 items-center gap-3 overflow-hidden rounded-xl border px-3 ${className ?? ""}`}
        >
          {fileInput}

          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt={t("thumbnailAlt")}
              className="h-24 w-24 shrink-0 rounded-lg object-cover"
            />
            <span className="text-foreground min-w-0 flex-1 truncate text-left text-sm">
              {fileName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            aria-label={t("remove")}
            className="text-muted-foreground hover:bg-neutral-fill-hover hover:text-accent focus-ring relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full before:absolute before:-inset-1.5 before:content-['']"
          >
            <DeleteIcon />
          </button>
        </div>
        {hasSizeError && <p className="text-danger text-center text-xs">{sizeErrorMessage}</p>}
      </>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={t("add")}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`border-border focus-ring relative flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border ${className ?? ""}`}
    >
      {fileInput}

      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <AddPosterIcon />
        <span className="text-sm">{t("add")}</span>
        {hasSizeError && <p className="text-danger text-center text-xs">{sizeErrorMessage}</p>}
      </div>
    </div>
  );
}
