"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { BusinessSlug } from "@/lib/businesses";

type Ctx = {
  business: BusinessSlug;
  setBusiness: (b: BusinessSlug) => void;
  /** True once the visitor picked a business type themselves. */
  chosen: boolean;
};

const BusinessContext = createContext<Ctx | null>(null);

/** Shares the selected business type between the leak selector, AI tabs and the audit form. */
export function BusinessProvider({ children }: { children: ReactNode }) {
  const [business, setBusinessState] = useState<BusinessSlug>("property");
  const [chosen, setChosen] = useState(false);
  const value = useMemo(
    () => ({
      business,
      chosen,
      setBusiness: (b: BusinessSlug) => {
        setBusinessState(b);
        setChosen(true);
      },
    }),
    [business, chosen],
  );
  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used inside BusinessProvider");
  return ctx;
}
