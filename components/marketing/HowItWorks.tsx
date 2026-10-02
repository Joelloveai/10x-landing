import { ChartColumn, FileText, MessageCircle, Send, type LucideIcon } from "lucide-react";
import { sectionIds } from "@/lib/site-config";
import { ChapterHeader } from "@/components/ui/ChapterHeader";

const steps: readonly { time: string; title: string; line: string; icon: LucideIcon }[] = [
  { time: "11:02 PM", title: "A lead messages you.", line: "A WhatsApp enquiry arrives after hours.", icon: MessageCircle },
  { time: "11:02 PM", title: "Aisyah drafts the reply.", line: "She writes it from the message and your records. Nothing is sent.", icon: FileText },
  { time: "8:00 AM", title: "You review and send.", line: "Edit the draft if you like. You send it when you are ready.", icon: Send },
  { time: "8:05 AM", title: "Ask what happened.", line: "Aiman answers how many leads came in overnight.", icon: ChartColumn },
];

/** Chapter 04. The 11pm story. Static: the AI drafts and answers, you decide what goes out. */
export function HowItWorks() {
  return (
    <section id={sectionIds.howItWorks} data-chapter aria-labelledby="how-title" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <ChapterHeader
          num="04"
          label="How it works"
          id="how-title"
          title="A lead messages you at 11pm."
          lead="Your AI drafts the reply. In the morning you read it and send it."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.title} className="rounded-2xl border border-border bg-surface p-6">
              <p className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-subtle">{s.time}</span>
                <s.icon className="size-5 text-accent-text" aria-hidden />
              </p>
              <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 text-[15px] text-secondary">{s.line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
