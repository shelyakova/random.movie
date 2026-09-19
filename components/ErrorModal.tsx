"use client";

import { useTranslations } from "next-intl";
import { useErrorStore } from "@/lib/stores/error.store";
import { useTranslateError } from "@/hooks/useTranslateError";
import ConfirmModal from "./ConfirmModal";

export default function ErrorModal() {
  const t = useTranslations("errors");
  const translateError = useTranslateError();
  const message = useErrorStore((state) => state.message);
  const clearError = useErrorStore((state) => state.clearError);

  if (!message) return null;

  return (
    <ConfirmModal
      title={t("somethingWentWrong")}
      message={translateError(message)}
      onConfirm={clearError}
    />
  );
}
