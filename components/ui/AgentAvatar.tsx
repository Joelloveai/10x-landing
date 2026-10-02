import type { Agent } from "@/lib/agents";
import { cn } from "@/lib/utils";

/** Initials in a circle. No photos, no generated faces. */
export function AgentAvatar({ agent, size = "md" }: { agent: Agent; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        agent.tone === "accent" ? "bg-accent text-accent-fg" : "bg-muted text-fg",
        size === "sm" ? "size-9 text-[14px]" : "size-14 text-[22px]",
      )}
    >
      {agent.initial}
    </span>
  );
}
