"use client";

import { useTranslations } from "next-intl";

export function useTranslateError() {
  const t = useTranslations();

  return (message: string | undefined) => {
    if (!message) return undefined;

    const key = message as never;
    return t.has(key) ? t(key) : message;
  };
}
