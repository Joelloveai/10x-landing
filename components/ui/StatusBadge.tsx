import { cn } from "@/lib/utils";

export type Status =
  | "Available now"
  | "Rollout in progress"
  | "Integration-dependent"
  | "Coming soon"
  | "Concept"
  | "Illustrative";

const tone: Record<Status, string> = {
  "Available now": "text-success-text ring-success/30 bg-success/10",
  "Rollout in progress": "text-fg ring-white/20 bg-white/[0.05]",
  "Integration-dependent": "text-secondary ring-white/15 bg-white/[0.04]",
  "Coming soon": "text-secondary ring-white/15 bg-white/[0.04]",
  Concept: "text-secondary ring-white/15 bg-white/[0.04]",
  Illustrative: "text-secondary ring-white/15 bg-white/[0.04]",
};

export function StatusBadge({ status, className }: { status: Status | string; className?: string }) {
  const cls = tone[status as Status] ?? tone["Coming soon"];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] ring-1 ring-inset",
        cls,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          // Solid green = live. Hollow green = rolling out. Grey = not yet.
          status === "Available now"
            ? "bg-success"
            : status === "Rollout in progress"
              ? "ring-1 ring-inset ring-accent-text"
              : "bg-muted",
        )}
      />
      {status}
    </span>
  );
}
