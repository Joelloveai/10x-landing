"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { track, trackOnce } from "@/lib/analytics";
import { normalizeMalaysianMobile } from "@/lib/phone";
import { sectionIds, siteConfig } from "@/lib/site-config";
import { verticalOptions, type VerticalOption } from "@/lib/verticals";
import { cn } from "@/lib/utils";
import { useVertical } from "@/components/providers/VerticalProvider";
import { ctaClasses } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { TrackedAnchor } from "@/components/ui/TrackedAnchor";

type Status = "idle" | "sending" | "success" | "error";

const leadRanges = [
  { value: "under-50", label: "Under 50" },
  { value: "50-200", label: "50–200" },
  { value: "200-500", label: "200–500" },
  { value: "500-plus", label: "500+" },
  { value: "not-sure", label: "Not sure" },
] as const;

const PHONE_ERRORS = {
  empty: "Please enter your WhatsApp number.",
  format: "Please enter a Malaysian mobile number, for example 012-XXX XXXX.",
  invalid: "That number doesn't look right. Please check it and try again.",
} as const;

function attribution() {
  const params = new URLSearchParams(window.location.search);
  let referral = params.get("ref") ?? undefined;
  if (!referral && document.referrer) {
    try {
      const origin = new URL(document.referrer).origin;
      if (origin !== window.location.origin) referral = origin;
    } catch {
      // ignore malformed referrer
    }
  }
  return {
    page: window.location.pathname,
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    referral,
  };
}

async function submitLead(body: Record<string, unknown>) {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: { ok?: boolean; error?: string; message?: string } = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON response, treated as failure below
  }
  if (!res.ok || !data.ok) {
    throw Object.assign(new Error("submit_failed"), { code: data.error ?? `http_${res.status}`, userMessage: data.message });
  }
  return data;
}

export function AuditForm() {
  const { vertical, chosen } = useVertical();
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef(0);
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [normalized, setNormalized] = useState<string | null>(null);

  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setFormError(null);

    const result = normalizeMalaysianMobile(phone);
    if (!result.ok) {
      setFieldError(PHONE_ERRORS[result.reason]);
      track("audit_form_error", { reason: `phone_${result.reason}` });
      inputRef.current?.focus();
      return;
    }
    setFieldError(null);
    setStatus("sending");

    try {
      await submitLead({
        whatsapp: result.e164,
        vertical: chosen ? vertical : undefined,
        source: "audit_form",
        company_website: honeypot,
        elapsedMs: Math.round(performance.now() - mountedAt.current),
        ...attribution(),
      });
      setNormalized(result.e164);
      setStatus("success");
      track("audit_form_submitted", { vertical: chosen ? vertical : "unknown" });
    } catch (err) {
      const e2 = err as { code?: string; userMessage?: string };
      setStatus("error");
      if (e2.code === "invalid_phone") {
        setFieldError(PHONE_ERRORS.format);
        setStatus("idle");
        inputRef.current?.focus();
      } else {
        setFormError(e2.code === "rate_limited" && e2.userMessage ? e2.userMessage : "Something went wrong. Please try again.");
      }
      track("audit_form_error", { reason: e2.code ?? "network" });
    }
  };

  return (
    <section
      id={sectionIds.audit}
      aria-labelledby="audit-title"
      className="relative isolate overflow-hidden border-y border-border bg-surface/60 py-28 md:py-40"
    >
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-5">Free Lead Leakage Audit</p>
          <h2 id="audit-title" data-focus-target className="text-display text-balance focus:outline-none">
            Find out where your leads are leaking. Free.
          </h2>
          <p className="text-lead mt-5 max-w-xl text-secondary">
            We&apos;ll review how enquiries move through your business and identify where response, follow-up, booking
            or handoff breaks down.
          </p>
          <ul className="mt-8 space-y-3 text-[16px] text-secondary">
            {[
              "A 15-minute review of how enquiries reach your team",
              "Where leads leak: response, follow-up, booking, handoff",
              "No obligation to buy anything",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <Check className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <div className="rounded-2xl border border-border bg-bg p-6 shadow-window sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {status !== "success" ? (
                <m.form
                  key="form"
                  noValidate
                  onSubmit={onSubmit}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  aria-describedby="audit-micro"
                >
                  <label htmlFor={inputId} className="block text-[15px] font-medium">
                    WhatsApp number
                  </label>
                  <div className="mt-2 flex flex-col gap-3">
                    <input
                      ref={inputRef}
                      id={inputId}
                      name="whatsapp"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="012-345 6789"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldError) setFieldError(null);
                      }}
                      onFocus={() => trackOnce("audit_form_started")}
                      aria-invalid={fieldError ? true : undefined}
                      aria-describedby={fieldError ? errorId : undefined}
                      maxLength={20}
                      className={cn(
                        "h-13 w-full rounded-xl border bg-elevated px-4 text-[17px] text-fg placeholder:text-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                        fieldError ? "border-warning" : "border-border focus:border-accent",
                      )}
                    />
                    {fieldError ? (
                      <p id={errorId} role="alert" className="text-[14px] text-warning-text">
                        {fieldError}
                      </p>
                    ) : null}

                    {/* Honeypot: hidden from people and assistive tech. */}
                    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label>
                        Company website
                        <input
                          tabIndex={-1}
                          autoComplete="off"
                          name="company_website"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      aria-disabled={status === "sending"}
                      className={ctaClasses("primary", "lg", "w-full disabled:cursor-wait disabled:opacity-80")}
                    >
                      {status === "sending" ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" aria-hidden />
                          Sending…
                        </>
                      ) : (
                        <>
                          {siteConfig.cta.formSubmit}
                          <ArrowRight className="size-4" aria-hidden />
                        </>
                      )}
                    </button>
                  </div>
                  <p id="audit-micro" className="mt-3 text-[14px] text-secondary">
                    30 seconds. We reply within 1 business day.
                  </p>
                  <div role="status" aria-live="polite">
                    {formError ? (
                      <p className="mt-4 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-[14px] text-fg">
                        {formError}{" "}
                        <span className="text-secondary">
                          You can also{" "}
                          <TrackedAnchor
                            href={siteConfig.contact.whatsappUrl}
                            event="whatsapp_clicked"
                            eventProps={{ location: "form_error" }}
                            external
                            className="text-accent-text underline underline-offset-4"
                          >
                            WhatsApp us
                          </TrackedAnchor>
                          .
                        </span>
                      </p>
                    ) : null}
                  </div>
                  <noscript>
                    <p className="mt-4 text-[14px] text-secondary">
                      This form needs JavaScript. You can WhatsApp or call us at {siteConfig.contact.phoneDisplay}.
                    </p>
                  </noscript>
                </m.form>
              ) : (
                <SuccessStep
                  key="success"
                  whatsapp={normalized ?? ""}
                  initialVertical={chosen ? vertical : undefined}
                  formMountedAt={mountedAt.current}
                />
              )}
            </AnimatePresence>
          </div>
          <p className="mt-4 text-center text-[14px] text-secondary">
            Prefer to talk now?{" "}
            <TrackedAnchor
              href={siteConfig.contact.whatsappUrl}
              event="whatsapp_clicked"
              eventProps={{ location: "audit" }}
              external
              className="text-fg underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              WhatsApp
            </TrackedAnchor>{" "}
            or call{" "}
            <TrackedAnchor
              href={`tel:${siteConfig.contact.phoneE164}`}
              event="phone_clicked"
              eventProps={{ location: "audit" }}
              className="whitespace-nowrap text-fg underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              {siteConfig.contact.phoneDisplay}
            </TrackedAnchor>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function SuccessStep({
  whatsapp,
  initialVertical,
  formMountedAt,
}: {
  whatsapp: string;
  initialVertical?: VerticalOption;
  formMountedAt: number;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [business, setBusiness] = useState<VerticalOption | undefined>(initialVertical);
  const [leads, setLeads] = useState<string | undefined>();
  const [state, setState] = useState<"ask" | "sending" | "done" | "skipped" | "error">("ask");

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const send = async () => {
    if (!business && !leads) {
      setState("skipped");
      return;
    }
    setState("sending");
    try {
      await submitLead({
        whatsapp,
        vertical: business,
        monthlyLeads: leads,
        source: "audit_form_qualification",
        elapsedMs: Math.round(performance.now() - formMountedAt),
        ...attribution(),
      });
      setState("done");
      track("audit_form_qualified", { vertical: business ?? "unknown", monthlyLeads: leads ?? "unknown" });
    } catch {
      setState("error");
    }
  };

  return (
    <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-success/15 text-success-text">
          <Check className="size-4" aria-hidden />
        </span>
        <h3 ref={headingRef} tabIndex={-1} className="text-[20px] font-semibold tracking-[-0.02em] focus:outline-none">
          Got it. We&apos;ll contact you shortly.
        </h3>
      </div>

      {state === "done" || state === "skipped" ? (
        <p className="mt-5 text-[16px] text-secondary" role="status">
          {state === "done" ? "Thanks. That helps us prepare your audit." : "No problem. We'll ask on WhatsApp."}
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          <p className="text-[15px] text-secondary">Optional: two quick questions help us prepare.</p>
          <PillGroup
            legend="What type of business are you?"
            options={verticalOptions}
            value={business}
            onChange={(v) => setBusiness(v as VerticalOption)}
          />
          <PillGroup
            legend="Roughly how many enquiries do you receive each month?"
            options={leadRanges}
            value={leads}
            onChange={setLeads}
          />
          {state === "error" ? (
            <p role="alert" className="text-[14px] text-warning-text">
              Something went wrong. Please try again. Your audit request is already saved.
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={send} disabled={state === "sending"} className={ctaClasses("primary", "md", "disabled:opacity-80")}>
              {state === "sending" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden /> Sending…
                </>
              ) : (
                "Send details"
              )}
            </button>
            <button type="button" onClick={() => setState("skipped")} className={ctaClasses("ghost", "md")}>
              Skip
            </button>
          </div>
        </div>
      )}
    </m.div>
  );
}

function PillGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: readonly { value: T; label: string }[];
  value: string | undefined;
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-3 text-[15px] font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "cursor-pointer rounded-full px-3.5 py-2 text-[14px] ring-1 ring-inset transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-text",
              value === o.value ? "bg-accent/15 text-fg ring-accent/60" : "text-secondary ring-white/12 hover:text-fg",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
