"use client";

import { useSyncExternalStore } from "react";

/** Tiny shared store for the chapter currently in focus. Written by FocusSystem, read by nav and rail. */
let active = "top";
const listeners = new Set<() => void>();

export function setActiveChapter(id: string) {
  if (id === active) return;
  active = id;
  listeners.forEach((l) => l());
}

export function useActiveChapter() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => active,
    () => "top",
  );
}
