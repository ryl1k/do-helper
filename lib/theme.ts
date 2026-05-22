"use client";
import { useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "theme";

function read(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(KEY) as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = read();
    setTheme(t);
    setMounted(true);
  }, []);

  function apply(t: Theme) {
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
    window.localStorage.setItem(KEY, t);
  }

  return {
    theme,
    mounted,
    toggle: () => apply(theme === "dark" ? "light" : "dark"),
    set: apply,
  };
}
