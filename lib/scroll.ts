/** Jumps longer than this skip the smooth animation, which would otherwise crawl across the page. */
const SMOOTH_MAX_PX = 1500;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Smooth-scroll to a section and move focus there for keyboard and screen-reader users.
 * Returns false when the target does not exist so callers can fall back to default navigation.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const alreadyThere = rect.top >= 0 && rect.top < window.innerHeight * 0.25;
  if (!alreadyThere) {
    // "instant" overrides the html scroll-behavior: smooth rule in globals.css.
    const smooth = !prefersReducedMotion() && Math.abs(rect.top) <= SMOOTH_MAX_PX;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" });
  }
  const focusTarget = el.querySelector<HTMLElement>("[data-focus-target]") ?? el;
  if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
  focusTarget.focus({ preventScroll: true });
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
  return true;
}
