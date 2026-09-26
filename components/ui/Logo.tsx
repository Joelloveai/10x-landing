import { LOGO_MARK_PATH, LOGO_MARK_VIEWBOX } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The 10X mark on its own. Sized by font-size (1em tall) unless a className sets width/height. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={LOGO_MARK_VIEWBOX}
      className={cn("h-[1em] w-auto shrink-0", className)}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={LOGO_MARK_PATH} />
    </svg>
  );
}

/** Mark + wordmark lockup. Scales with font-size. */
export function Logo({ className, markOnly = false }: { className?: string; markOnly?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.35em] font-semibold tracking-[-0.04em] text-fg", className)}>
      <LogoMark className="h-[0.9em]" />
      {markOnly ? <span className="sr-only">10X</span> : <span className="leading-none">10X</span>}
    </span>
  );
}
