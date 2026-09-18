"use client";

import SearchBar from "./SearchBar";
import Logo from "./Logo";
import { SettingsIcon, SmileyIcon, LogoutIcon, PlusIcon, SunIcon, MoonIcon } from "./icons";
import { IconButton } from "./IconButton";
import Tooltip from "./Tooltip";
import { Theme } from "@/lib/types";
import { useThemeStore } from "@/lib/stores";

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
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <header className="grid w-full grid-cols-[1fr_3fr_1fr] items-center gap-4 py-11">
      <div className="justify-self-start">
        <Logo />
      </div>

      <div className="flex items-center justify-center gap-5">
        <Tooltip content="Settings">
          <IconButton onClick={onOpenCategoriesModal} aria-label="Settings">
            <SettingsIcon />
          </IconButton>
        </Tooltip>

        <Tooltip content={theme === Theme.Dark ? "Switch to light theme" : "Switch to dark theme"}>
          <IconButton onClick={toggleTheme} aria-label="Toggle theme">
            {theme === Theme.Dark ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Tooltip>

        <SearchBar value={searchValue} onChange={onSearchChange} />

        <Tooltip content="Randomize">
          <IconButton
            onClick={onClickRandomize}
            aria-label="Randomize"
            className="!bg-info-bg !text-info-foreground"
          >
            <SmileyIcon />
          </IconButton>
        </Tooltip>

        <Tooltip content="Logout">
          <IconButton onClick={onOpenLogoutConfirmModal} aria-label="Logout">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className="justify-self-end">
        <Tooltip content="Add film">
          <IconButton onClick={onOpenFilmModal} aria-label="Add films">
            <PlusIcon />
          </IconButton>
        </Tooltip>
      </div>
    </header>
  );
}
