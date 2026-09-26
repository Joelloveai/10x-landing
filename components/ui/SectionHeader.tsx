import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Max width utility for the header block. */
  width?: string;
  id?: string;
};

export function SectionHeader({ eyebrow, title, lead, align = "left", className, width = "max-w-3xl", id }: Props) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", width, className)}>
      {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
      <h2 id={id} className="text-display text-balance">
        {title}
      </h2>
      {lead ? <p className="text-lead mt-5 text-pretty text-secondary">{lead}</p> : null}
    </Reveal>
  );
}
