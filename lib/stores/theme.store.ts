import { create } from "zustand";
import { Theme } from "@/lib/types";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return Theme.Light;

  const stored = localStorage.getItem("theme");
  if (stored === Theme.Light || stored === Theme.Dark) return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? Theme.Dark : Theme.Light;
}

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === Theme.Dark);
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: getInitialTheme(),

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    applyThemeClass(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === Theme.Dark ? Theme.Light : Theme.Dark;
    get().setTheme(next);
  },
}));
