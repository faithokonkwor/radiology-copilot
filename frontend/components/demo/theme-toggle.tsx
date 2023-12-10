"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("radiology-copilot-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = stored ? stored === "dark" : prefersDark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem("radiology-copilot-theme", nextDark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark mode"
      className="group inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-3 py-2 text-sm font-semibold text-slate-900 shadow-2xl shadow-emerald-950/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-slate-950/70 dark:text-white dark:shadow-red-950/20"
    >
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700 transition dark:bg-red-500/15 dark:text-red-200">
        <Sun className="absolute size-4 rotate-0 scale-100 transition dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition dark:rotate-0 dark:scale-100" />
      </span>
      {dark ? "Dark" : "Light"}
    </button>
  );
}
