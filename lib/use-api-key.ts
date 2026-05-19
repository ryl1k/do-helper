"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "apiKey";

export function useApiKey() {
  const [key, setKey] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setKey(localStorage.getItem(STORAGE_KEY));
    setLoaded(true);
  }, []);

  function save(k: string) {
    const trimmed = k.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    setKey(trimmed);
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
    setKey(null);
  }

  return { key, loaded, save, clear };
}
