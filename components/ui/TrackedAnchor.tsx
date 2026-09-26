"use client";

import type { ReactNode } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

type Props = {
  href: string;
  event: AnalyticsEvent;
  eventProps?: AnalyticsProps;
  className?: string;
  children: ReactNode;
  external?: boolean;
  "aria-label"?: string;
};

/** Plain link that records an anonymous analytics event (never the number or address itself). */
export function TrackedAnchor({ href, event, eventProps, className, children, external, ...rest }: Props) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(event, eventProps)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
