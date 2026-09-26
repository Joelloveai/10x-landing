import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline font-semibold tracking-[-0.04em] text-fg", className)}>
      10<span className="text-accent-text">X</span>
    </span>
  );
}
