"use client";

import SearchBar from "./SearchBar";
import Logo from "./Logo";
import { SettingsIcon, SmileyIcon, LogoutIcon, PlusIcon, SunIcon, MoonIcon } from "./icons";
import { IconButton } from "./IconButton";
import Tooltip from "./Tooltip";
import { Theme } from "@/lib/types";
import { useThemeStore } from "@/lib/stores";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { setLocale } from "@/i18n/actions";
import type { Locale } from "@/i18n/config";

// Two-locale toggle: the button shows the language it switches to.
const LOCALE_BUTTON_LABELS: Record<Locale, string> = { en: "EN", uk: "UA" };

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onOpenLogoutConfirmModal: () => void;
  onOpenCategoriesModal: () => void;
  onOpenFilmModal: () => void;
  onClickRandomize: () => void;
}

export default function Header({
  searchValue,
  onSearchChange,
  onOpenLogoutConfirmModal,
  onOpenCategoriesModal,
  onOpenFilmModal,
  onClickRandomize,
}: HeaderProps) {
  const t = useTranslations("header");
  const tCommon = useTranslations("common");
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const locale = useLocale();
  const [isLocalePending, startLocaleTransition] = useTransition();

  const nextLocale: Locale = locale === "en" ? "uk" : "en";
  const switchLocaleLabel = locale === "en" ? t("switchToUkrainian") : t("switchToEnglish");

  const handleToggleLocale = () => {
    startLocaleTransition(async () => {
      await setLocale(nextLocale);
    });
  };

  return (
    <header className="nav:grid-cols-[1fr_3fr_1fr] nav:py-11 tv:grid-cols-[auto_1fr_auto] tv:pt-10 tv:pb-2 grid w-full grid-cols-[1fr_auto] items-center gap-4 py-4 sm:py-6">
      <div className="col-start-1 row-start-1 justify-self-start">
        <Logo />
      </div>

      <div className="nav:col-span-1 nav:col-start-2 nav:row-start-1 nav:gap-5 col-span-2 col-start-1 row-start-2 flex items-center justify-center gap-2 max-sm:flex-wrap sm:gap-3">
        <Tooltip content={t("settings")}>
          <IconButton onClick={onOpenCategoriesModal} aria-label={t("settings")}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>

        <Tooltip content={theme === Theme.Dark ? t("switchToLightTheme") : t("switchToDarkTheme")}>
          <IconButton onClick={toggleTheme} aria-label={t("toggleTheme")}>
            {theme === Theme.Dark ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip content={switchLocaleLabel}>
          <IconButton
            onClick={handleToggleLocale}
            disabled={isLocalePending}
            aria-label={switchLocaleLabel}
            className="text-sm font-semibold"
          >
            {LOCALE_BUTTON_LABELS[nextLocale]}
          </IconButton>
        </Tooltip>

        <SearchBar value={searchValue} onChange={onSearchChange} className="max-sm:order-last" />

        <Tooltip content={t("randomize")}>
          <IconButton
            onClick={onClickRandomize}
            aria-label={t("randomize")}
            className="!bg-info-bg !text-info-foreground"
          >
            <SmileyIcon />
          </IconButton>
        </Tooltip>

        <Tooltip content={tCommon("logout")}>
          <IconButton onClick={onOpenLogoutConfirmModal} aria-label={tCommon("logout")}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className="nav:col-start-3 col-start-2 row-start-1 justify-self-end">
        <Tooltip content={t("addFilm")}>
          <IconButton onClick={onOpenFilmModal} aria-label={t("addFilm")}>
            <PlusIcon />
          </IconButton>
        </Tooltip>
      </div>
    </header>
  );
}
