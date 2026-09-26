import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/ui/Logo";
import { Footer } from "@/components/marketing/Footer";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <header className="border-b border-border">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/" aria-label="10X home" className="text-[22px]">
            <Logo />
          </Link>
          <Link href="/#audit" className="text-[14px] text-secondary hover:text-fg">
            {siteConfig.cta.primaryShort} →
          </Link>
        </div>
      </header>
      <main id="main" className="container-x max-w-3xl py-16 md:py-24">
        <p className="eyebrow">Legal</p>
        <h1 className="text-display mt-4">{title}</h1>
        <p className="mt-3 text-[14px] text-secondary">Last updated: {updated}</p>
        <div
          role="note"
          className="mt-8 rounded-xl border border-warning/40 bg-warning/10 px-5 py-4 text-[15px] leading-relaxed text-fg"
        >
          <strong className="font-semibold">Draft.</strong> This page is a working draft pending legal review. It
          describes how the 10X website currently handles information and is not legal advice. The final version may
          change.
        </div>
        <div className="legal mt-10 space-y-6 text-[16px] leading-relaxed text-secondary [&_h2]:mt-12 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-fg [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2 [&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
