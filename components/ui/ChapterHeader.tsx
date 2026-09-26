import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  num: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * Chapter opener. The numbered marker lights up (blue + subtle halo) only while
 * its chapter is in focus; FocusSystem sets <html data-focus> and CSS matches the chapter id.
 */
export function ChapterHeader({ num, label, title, lead, id, align = "left", className }: Props) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("mb-5 flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="chapter-marker flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-mono text-[11px] text-subtle ring-1 ring-inset ring-white/12 transition-all duration-500">
          {num}
        </span>
        <span className="eyebrow">{label}</span>
      </p>
      <h2 id={id} className="text-display text-balance">
        {title}
      </h2>
      {lead ? <p className="text-lead mt-5 text-pretty text-secondary">{lead}</p> : null}
    </Reveal>
  );
}
