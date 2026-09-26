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
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }
  const focusTarget = el.querySelector<HTMLElement>("[data-focus-target]") ?? el;
  if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
  focusTarget.focus({ preventScroll: true });
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
  return true;
}
