"use client";

import { useErrorStore } from "@/lib/stores/error.store";
import ConfirmModal from "./ConfirmModal";

export default function ErrorModal() {
  const message = useErrorStore((state) => state.message);
  const clearError = useErrorStore((state) => state.clearError);

  if (!message) return null;

  return <ConfirmModal title="Something went wrong" message={message} onConfirm={clearError} />;
}
