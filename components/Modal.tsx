"use client";

import { KeyboardEvent, ReactNode, useEffect, useId, useRef } from "react";
import { CloseIcon, EditIcon, RefreshIcon } from "./icons";
import Tooltip from "./Tooltip";
import { useTranslations } from "next-intl";
import { ArrowKey, findSpatialNeighbor, isArrowKey } from "@/lib/utils/spatial-navigation";

interface ModalProps {
  title: string;
  onRefresh?: () => void;
  refreshTooltip?: string;
  onEdit?: () => void;
  isEdit?: boolean;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  hideFooterBorder?: boolean;
  className?: string;
  role?: "dialog" | "alertdialog";
  ariaLabel?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Controls whose own arrow-key behaviour (caret movement, option picking) must win over navigation.
const NATIVE_ARROW_SELECTOR = 'textarea, select, [contenteditable="true"]';
const ARROW_SCROLL_STEP = 80;

export default function Modal({
  title,
  onRefresh,
  onEdit,
  isEdit,
  onClose,
  children,
  footer,
  hideFooterBorder = false,
  className,
  role = "dialog",
  ariaLabel,
}: ModalProps) {
  const t = useTranslations("common");
  const tFilm = useTranslations("film");
  const editIconStyle = isEdit
    ? "focus-ring cursor-pointer rounded-full p-3 text-accent"
    : "focus-ring cursor-pointer rounded-full p-3 text-foreground";
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, []);

  const getFocusable = () =>
    Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []).filter(
      (el) => el.offsetParent !== null,
    );

  // TV remotes only send arrow keys (no Tab), so move focus spatially between controls; focusing an
  // element scrolls it into view, which is what makes the scrollable modal body reachable.
  const handleArrowKey = (event: KeyboardEvent<HTMLDivElement>, key: ArrowKey) => {
    const dialog = dialogRef.current;
    const target = event.target as HTMLElement;
    if (!dialog || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    // A nested modal (e.g. ConfirmModal inside CategoriesModal) handles its own keys.
    if (target.closest('[role="dialog"], [role="alertdialog"]') !== dialog) return;
    if (target.closest(NATIVE_ARROW_SELECTOR)) return;
    if (target instanceof HTMLInputElement && (key === "ArrowLeft" || key === "ArrowRight")) return;

    event.preventDefault();
    event.stopPropagation();

    const focusable = getFocusable();
    const fromIndex = focusable.indexOf(target);

    if (fromIndex === -1) {
      // First press right after opening: start at the content rather than the header icons.
      (focusable.find((el) => bodyRef.current?.contains(el)) ?? focusable[0])?.focus();
      return;
    }

    const nextIndex = findSpatialNeighbor(
      target.getBoundingClientRect(),
      fromIndex,
      focusable.map((el) => el.getBoundingClientRect()),
      key,
    );

    if (nextIndex !== -1) {
      focusable[nextIndex].focus();
      focusable[nextIndex].scrollIntoView({ block: "nearest", inline: "nearest" });
      return;
    }

    // Nothing focusable that way — still let the remote scroll through non-interactive content.
    if (key === "ArrowUp" || key === "ArrowDown") {
      bodyRef.current?.scrollBy({
        top: key === "ArrowDown" ? ARROW_SCROLL_STEP : -ARROW_SCROLL_STEP,
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      if (!onClose) return;
      event.stopPropagation();
      onClose();
      return;
    }

    if (isArrowKey(event.key)) {
      handleArrowKey(event, event.key);
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = getFocusable();

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !dialogRef.current.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last || !dialogRef.current.contains(active)) {
      event.preventDefault();
      first.focus();
    }

    event.stopPropagation();
  };

  return (
    <div className="bg-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`bg-surface relative flex max-h-[90dvh] w-full max-w-sm flex-col rounded-3xl p-6 outline-none ${className ?? ""}`}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-foreground text-2xl font-semibold">
            {title}
          </h2>

          <div className="-my-1.5 -mr-3 flex shrink-0 items-center">
            {onRefresh && (
              <Tooltip content={tFilm("updateFromTmdb")}>
                <button
                  type="button"
                  onClick={onRefresh}
                  aria-label={tFilm("updateFromTmdb")}
                  className="text-accent focus-ring cursor-pointer rounded-full p-3"
                >
                  <RefreshIcon />
                </button>
              </Tooltip>
            )}

            {onEdit && (
              <Tooltip content={t("edit")}>
                <button
                  type="button"
                  onClick={onEdit}
                  aria-label={t("edit")}
                  className={editIconStyle}
                >
                  <EditIcon />
                </button>
              </Tooltip>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="text-foreground focus-ring cursor-pointer rounded-full p-3"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        <div
          ref={bodyRef}
          className="themed-scrollbar -mx-1 mt-3 -mb-1 flex min-h-0 flex-1 flex-col overflow-y-auto px-1 py-1"
        >
          {children}
        </div>

        {footer && (
          <div className={hideFooterBorder ? "mt-4" : "border-border-subtle mt-4 border-t pt-4"}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
