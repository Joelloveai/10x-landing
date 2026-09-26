"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { VerticalSlug } from "@/lib/verticals";

type Ctx = {
  vertical: VerticalSlug;
  setVertical: (v: VerticalSlug) => void;
  /** True once the visitor picked a vertical themselves. */
  chosen: boolean;
};

const VerticalContext = createContext<Ctx | null>(null);

/** Shares the selected industry between the selector, AI section and audit form. */
export function VerticalProvider({ children }: { children: ReactNode }) {
  const [vertical, setVerticalState] = useState<VerticalSlug>("property");
  const [chosen, setChosen] = useState(false);
  const value = useMemo(
    () => ({
      vertical,
      chosen,
      setVertical: (v: VerticalSlug) => {
        setVerticalState(v);
        setChosen(true);
      },
    }),
    [vertical, chosen],
  );
  return <VerticalContext.Provider value={value}>{children}</VerticalContext.Provider>;
}

export function useVertical() {
  const ctx = useContext(VerticalContext);
  if (!ctx) throw new Error("useVertical must be used inside VerticalProvider");
  return ctx;
}
