/**
 * The four named agents. Capabilities list only what the product does today:
 * the AI answers and drafts. It does not send messages or act on its own.
 */
export type Agent = {
  name: string;
  role: string;
  initial: string;
  /** Aisyah uses the accent; the others stay muted so the page keeps one accent. */
  tone: "accent" | "muted";
  bullets: readonly string[];
};

export const agents: readonly Agent[] = [
  {
    name: "Aisyah",
    role: "Sales",
    initial: "A",
    tone: "accent",
    bullets: [
      "Answers questions about any lead or deal",
      "Drafts WhatsApp replies you can send",
      "Summarises the pipeline in plain English",
    ],
  },
  {
    name: "Daniel",
    role: "Marketing",
    initial: "D",
    tone: "muted",
    bullets: ["Drafts WhatsApp templates and campaign copy", "Suggests the next message for any lead"],
  },
  {
    name: "Priya",
    role: "Ops",
    initial: "P",
    tone: "muted",
    bullets: ["Finds any record in one sentence", "Lists the work still outstanding on your deals"],
  },
  {
    name: "Aiman",
    role: "Admin",
    initial: "A",
    tone: "muted",
    bullets: [
      "Answers questions like \"How many leads this week?\"",
      "Drafts replies you can send",
      "Explains every stage of every pipeline",
    ],
  },
];
