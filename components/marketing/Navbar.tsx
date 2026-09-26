"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, sectionIds, siteConfig } from "@/lib/site-config";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { CtaLink } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useFocusTrap(panelRef, open, close);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (e.metaKey || e.ctrlKey) return;
    // Let the menu close before scrolling so focus lands on the section.
    requestAnimationFrame(() => {
      if (scrollToId(href.slice(1))) return;
      window.location.hash = href;
    });
    e.preventDefault();
  };

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        solid ? "border-border bg-bg/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-md focus:bg-elevated focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="container-x flex h-16 items-center gap-6">
        <a href="#top" aria-label="10X home" className="-ml-1 rounded-md px-1 text-[22px]">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => onNavClick(e, l.href)}
                className="rounded-full px-3 py-2 text-[14px] text-secondary transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="hidden h-8 items-center gap-1 rounded-md px-2 font-mono text-[12px] text-subtle ring-1 ring-inset ring-white/10 transition-colors hover:text-secondary xl:inline-flex"
            aria-label="Open quick navigation (Control or Command K)"
          >
            <kbd className="font-mono">⌘K</kbd>
          </button>
          <CtaLink
            href={`#${sectionIds.audit}`}
            event="nav_cta_click"
            size="sm"
          >
            {siteConfig.cta.primaryShort}
          </CtaLink>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex size-10 items-center justify-center rounded-full text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="h-[calc(100dvh-64px)] overflow-y-auto border-t border-border bg-bg lg:hidden"
        >
          <ul className="container-x flex flex-col py-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => onNavClick(e, l.href)}
                  className="flex items-center justify-between border-b border-border py-4 text-[20px] font-medium tracking-[-0.02em]"
                >
                  {l.label}
                  <span aria-hidden className="text-subtle">→</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="container-x pb-10 pt-2">
            <CtaLink
              href={`#${sectionIds.audit}`}
              event="nav_cta_click"
              eventProps={{ location: "mobile_menu" }}
              size="lg"
              className="w-full"
              onNavigate={close}
            >
              {siteConfig.cta.primary}
            </CtaLink>
            <p className="mt-3 text-center text-[14px] text-secondary">{siteConfig.cta.microcopy}</p>
            <button type="button" onClick={close} className="sr-only focus:not-sr-only">
              Close menu
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
