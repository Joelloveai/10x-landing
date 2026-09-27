"use client";

import { useEffect, useId, useState } from "react";
import { m, useSpring, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { trackOnce } from "@/lib/analytics";
import { businessBySlug } from "@/lib/businesses";
import { useReducedMotionPref } from "@/lib/hooks/useMediaQuery";
import { formatRM } from "@/lib/utils";
import { useBusiness } from "@/components/providers/BusinessProvider";
import { Tilt } from "@/components/ui/Tilt";

const LIMITS = {
  leads: { min: 10, max: 1000, step: 10 },
  missed: { min: 5, max: 60, step: 1 },
  conversion: { min: 1, max: 50, step: 1 },
  value: { min: 100, max: 50000, step: 100 },
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** monthly enquiries × missed % × conversion % × average customer value × 12 */
export function calculateOpportunity(leads: number, missedPct: number, conversionPct: number, value: number) {
  const missedLeads = leads * (missedPct / 100);
  const lostCustomers = missedLeads * (conversionPct / 100);
  const monthly = lostCustomers * value;
  return { missedLeads, lostCustomers, monthly, annual: monthly * 12 };
}

export function LossCalculator() {
  const { business } = useBusiness();
  const [leads, setLeads] = useState(100);
  const [missed, setMissed] = useState(20);
  const [conversion, setConversion] = useState(10);
  const [value, setValue] = useState(businessBySlug[business].calculatorValue);
  const [valueEdited, setValueEdited] = useState(false);

  // Follow the selected business until the visitor sets their own value.
  useEffect(() => {
    if (!valueEdited) setValue(businessBySlug[business].calculatorValue);
  }, [business, valueEdited]);

  const result = calculateOpportunity(leads, missed, conversion, value);
  const used = () => trackOnce("calculator_used");

  return (
    <Tilt max={1.5}>
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="p-6 sm:p-8">
          <h3 id="calculator-title" className="text-title">
            What could your missed leads be worth?
          </h3>
          <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <Slider
              label="Monthly enquiries"
              value={leads}
              display={leads.toLocaleString("en-MY")}
              valueText={`${leads} enquiries per month`}
              {...LIMITS.leads}
              onChange={(n) => {
                setLeads(n);
                used();
              }}
            />
            <Slider
              label="Estimated missed"
              value={missed}
              display={`${missed}%`}
              valueText={`${missed} percent`}
              {...LIMITS.missed}
              onChange={(n) => {
                setMissed(n);
                used();
              }}
            />
            <Slider
              label="Conversion rate"
              value={conversion}
              display={`${conversion}%`}
              valueText={`${conversion} percent`}
              {...LIMITS.conversion}
              onChange={(n) => {
                setConversion(n);
                used();
              }}
            />
            <ValueInput
              value={value}
              onChange={(n) => {
                setValue(n);
                setValueEdited(true);
                used();
              }}
            />
          </div>
        </div>

        <div className="flex flex-col border-t border-border bg-[#0d0d0e] p-6 sm:p-8 lg:border-l lg:border-t-0">
          <p className="text-[14px] text-secondary">Estimated annual opportunity</p>
          <AnimatedRM
            value={result.annual}
            className="mt-2 text-[clamp(2.25rem,1.6rem+2.6vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]"
          />
          <p className="mt-3 text-[15px] text-secondary">
            About <span className="text-fg">{formatRM(result.monthly)}</span> a month from{" "}
            <span className="text-fg">{fmt(result.missedLeads)}</span> missed enquiries
          </p>

          <details className="group mt-6 rounded-xl border border-border bg-white/[0.02]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[14px] text-secondary transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
              Show the math
              <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="space-y-1 px-4 pb-4 font-mono text-[13px] leading-relaxed text-secondary">
              <p>{leads.toLocaleString("en-MY")} monthly enquiries</p>
              <p>× {missed}% missed</p>
              <p>× {conversion}% conversion</p>
              <p>× {formatRM(value)} average value</p>
              <p className="text-fg">= {formatRM(result.monthly)} a month</p>
              <p>× 12 = {formatRM(result.annual)} a year</p>
            </div>
          </details>

          <p className="mt-auto pt-6 text-[13px] text-secondary">Estimate only. Actual results vary.</p>
        </div>
      </div>
    </Tilt>
  );
}

function fmt(n: number) {
  return n >= 10 ? Math.round(n).toLocaleString("en-MY") : n.toFixed(1).replace(/\.0$/, "");
}

function Slider({
  label,
  value,
  display,
  valueText,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  valueText: string;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] text-fg">
          {label}
        </label>
        <span className="shrink-0 font-mono text-[14px] text-accent-text" aria-hidden>
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        style={{ ["--fill" as string]: `${fill}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ValueInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const id = useId();
  const { min, max, step } = LIMITS.value;
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={`${id}-num`} className="text-[15px] text-fg">
          Customer value
        </label>
        <div className="flex items-center rounded-lg border border-border bg-elevated pl-2 focus-within:border-accent">
          <span className="font-mono text-[13px] text-secondary">RM</span>
          <input
            id={`${id}-num`}
            inputMode="numeric"
            value={draft}
            onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
            onBlur={() => {
              const n = clamp(Number(draft) || min, min, max);
              onChange(n);
              setDraft(String(n));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="w-20 bg-transparent px-1.5 py-1 text-right font-mono text-[14px] text-accent-text focus:outline-none"
          />
        </div>
      </div>
      <input
        type="range"
        className="range"
        aria-label="Average customer value slider"
        aria-valuetext={formatRM(value)}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ["--fill" as string]: `${fill}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function AnimatedRM({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(value, { stiffness: 90, damping: 22, mass: 0.8 });
  const text = useTransform(spring, (v) => formatRM(v));
  const reduced = useReducedMotionPref();

  useEffect(() => {
    if (reduced) spring.jump(value);
    else spring.set(value);
  }, [value, reduced, spring]);

  return (
    <>
      <m.p aria-hidden className={className}>
        {text}
      </m.p>
      <p className="sr-only">{formatRM(value)} per year</p>
    </>
  );
}
