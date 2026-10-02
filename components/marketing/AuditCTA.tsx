"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { track, trackOnce } from "@/lib/analytics";
import { businessTypeOptions, type BusinessTypeOption } from "@/lib/businesses";
import { normalizeMalaysianMobile } from "@/lib/phone";
import { salesMailto, sectionIds, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useBusiness } from "@/components/providers/BusinessProvider";
import { ctaClasses } from "@/components/ui/CtaLink";
import { Reveal } from "@/components/ui/Reveal";
import { TrackedAnchor } from "@/components/ui/TrackedAnchor";
import { AUDIT_FORM_ID, FinalCTA } from "./FinalCTA";

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

const copy = {
  title: "Join the waitlist.",
  body: "Leave your WhatsApp number and we will be in touch. Tell us about your business after, if you like.",
  submit: siteConfig.cta.formSubmit,
  source: "waitlist_form",
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

/** Chapter 07. One form: join the waitlist. */
export function AuditCTA() {
  const { business, chosen } = useBusiness();
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
      track("audit_error", { reason: `phone_${result.reason}` });
      inputRef.current?.focus();
      return;
    }
    setFieldError(null);
    setStatus("sending");

    try {
      await submitLead({
        whatsapp: result.e164,
        businessType: chosen ? business : undefined,
        source: copy.source,
        company_website: honeypot,
        elapsedMs: Math.round(performance.now() - mountedAt.current),
        ...attribution(),
      });
      setNormalized(result.e164);
      setStatus("success");
      track("audit_submitted", { vertical: chosen ? business : "unknown" });
    } catch (err) {
      const e2 = err as { code?: string; userMessage?: string };
      if (e2.code === "invalid_phone") {
        setFieldError(PHONE_ERRORS.format);
        setStatus("idle");
        inputRef.current?.focus();
      } else {
        setStatus("error");
        setFormError(e2.code === "rate_limited" && e2.userMessage ? e2.userMessage : "Something went wrong. Please try again.");
      }
      track("audit_error", { reason: e2.code ?? "network" });
    }
  };

  return (
    <section
      id={sectionIds.audit}
      data-chapter
      aria-labelledby="audit-title"
      className="relative isolate overflow-hidden border-t border-border py-24 md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.045),transparent_75%)]"
      />
      <div className="container-x">
        <FinalCTA>
          <Reveal delay={80} className="mx-auto mt-12 max-w-xl">
            <div id={AUDIT_FORM_ID} className="halo rounded-2xl border border-accent/40 bg-surface p-6 shadow-window sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                {status !== "success" ? (
                  <m.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    <div id="contact-form">
                    <form noValidate onSubmit={onSubmit} aria-describedby="audit-micro">
                      <h3 className="text-title text-balance">{copy.title}</h3>
                      <p className="mt-2 text-[15px] text-secondary">{copy.body}</p>

                      <label htmlFor={inputId} className="mt-6 block text-[15px] font-medium">
                        WhatsApp number
                      </label>
                      <input
                        ref={inputRef}
                        id={inputId}
                        name="whatsapp"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="012-000 0000"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (fieldError) setFieldError(null);
                        }}
                        onFocus={() => trackOnce("audit_started")}
                        aria-invalid={fieldError ? true : undefined}
                        aria-describedby={fieldError ? errorId : undefined}
                        maxLength={20}
                        className={cn(
                          "mt-2 h-13 w-full rounded-xl border bg-elevated px-4 text-[17px] text-fg placeholder:text-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                          fieldError ? "border-warning" : "border-border focus:border-accent",
                        )}
                      />
                      {fieldError ? (
                        <p id={errorId} role="alert" className="mt-2 text-[14px] text-warning-text">
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
                        className={ctaClasses("primary", "lg", "mt-6 w-full disabled:cursor-wait disabled:opacity-80")}
                      >
                        {status === "sending" ? (
                          <>
                            <LoaderCircle className="size-4 animate-spin" aria-hidden />
                            Sending…
                          </>
                        ) : (
                          <>
                            {copy.submit}
                            <ArrowRight className="size-4" aria-hidden />
                          </>
                        )}
                      </button>
                      <p id="audit-micro" className="mt-3 text-center text-[14px] text-secondary">
                        {siteConfig.cta.microcopy}
                      </p>
                      <div role="status" aria-live="polite">
                        {formError ? (
                          <p className="mt-4 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-[14px] text-fg">
                            {formError} <span className="text-secondary">You can also email the {siteConfig.contact.label} at </span>
                            <a href={salesMailto} className="text-accent-text underline underline-offset-4">
                              {siteConfig.contact.email}
                            </a>
                            .
                          </p>
                        ) : null}
                      </div>
                      <noscript>
                        <p className="mt-4 text-[14px] text-secondary">
                          This form needs JavaScript. You can email the {siteConfig.contact.label} at {siteConfig.contact.email}.
                        </p>
                      </noscript>
                    </form>
                    </div>
                  </m.div>
                ) : (
                  <SuccessStep
                    key="success"
                    whatsapp={normalized ?? ""}
                    initialBusiness={chosen ? business : undefined}
                    formMountedAt={mountedAt.current}
                  />
                )}
              </AnimatePresence>
            </div>
            <p className="mt-5 text-center text-[14px] text-secondary">
              Prefer email? {siteConfig.contact.label} ·{" "}
              <TrackedAnchor
                href={salesMailto}
                event="email_clicked"
                eventProps={{ location: "contact" }}
                className="text-fg underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {siteConfig.contact.email}
              </TrackedAnchor>
            </p>
          </Reveal>
        </FinalCTA>
      </div>
    </section>
  );
}

function SuccessStep({
  whatsapp,
  initialBusiness,
  formMountedAt,
}: {
  whatsapp: string;
  initialBusiness?: BusinessTypeOption;
  formMountedAt: number;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [business, setBusiness] = useState<BusinessTypeOption | undefined>(initialBusiness);
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
        businessType: business,
        monthlyLeads: leads,
        source: "waitlist_form_qualification",
        elapsedMs: Math.round(performance.now() - formMountedAt),
        ...attribution(),
      });
      setState("done");
      track("audit_qualified", { vertical: business ?? "unknown", monthlyLeads: leads ?? "unknown" });
    } catch {
      setState("error");
    }
  };

  return (
    <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/15 text-success-text">
          <Check className="size-4" aria-hidden />
        </span>
        <h3 ref={headingRef} tabIndex={-1} className="text-[20px] font-semibold tracking-[-0.02em] focus:outline-none">
          Got it. You are on the waitlist.
        </h3>
      </div>

      {state === "done" || state === "skipped" ? (
        <p className="mt-5 text-[16px] text-secondary" role="status">
          {state === "done" ? "Thanks. That helps us prepare." : "No problem. We'll ask when we speak."}
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          <p className="text-[15px] text-secondary">Optional: two quick questions help us prepare.</p>
          <PillGroup
            legend="What type of business are you?"
            options={businessTypeOptions}
            value={business}
            onChange={(v) => setBusiness(v as BusinessTypeOption)}
          />
          <PillGroup
            legend="Roughly how many enquiries do you receive each month?"
            options={leadRanges}
            value={leads}
            onChange={setLeads}
          />
          {state === "error" ? (
            <p role="alert" className="text-[14px] text-warning-text">
              Something went wrong. Please try again. Your request is already saved.
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
