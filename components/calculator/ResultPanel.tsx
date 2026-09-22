"use client";

import { useState } from "react";
import { CalculationOutput } from "@/lib/calculators/types";
import { CubeIcon, ScaleIcon, DollarIcon, CartIcon, ChevronDownIcon } from "@/components/icons/Icons";

function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }
  document.body.removeChild(textarea);
  return succeeded;
}

function iconForStat(label: string, value: string) {
  const text = `${label} ${value}`;
  if (/\$/.test(text)) return DollarIcon;
  if (/ton/i.test(text)) return ScaleIcon;
  if (/order/i.test(text)) return CartIcon;
  return CubeIcon;
}

export function ResultPanel({ result }: { result: CalculationOutput }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    const lines = [
      `${result.primaryValue}${result.primaryUnit ? ` ${result.primaryUnit}` : ""} — ${result.primaryExplanation}`,
      ...(result.conversion ? [result.conversion] : []),
      "",
      ...result.secondary.map((item) => `${item.label}: ${item.value}`),
      "",
      ...result.breakdown.map((row) => `${row.label}: ${row.value}${row.note ? ` (${row.note})` : ""}`),
    ];
    const text = lines.join("\n");

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setCopyState("copied");
    } catch {
      const fallbackWorked = legacyCopy(text);
      setCopyState(fallbackWorked ? "copied" : "failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  }

  const statCards = [
    ...result.secondary,
    {
      label: result.primaryExplanation,
      value: `${result.primaryValue}${result.primaryUnit ? ` ${result.primaryUnit}` : ""}`,
      description: result.conversion,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-[var(--shadow-lg)]">
      <div className="h-1.5" style={{ background: "var(--gradient-hero)" }} />
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
            Results
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-md border border-border-strong px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            {copyState === "copied" ? "Copied!" : copyState === "failed" ? "Couldn't copy" : "Copy Result"}
          </button>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-[40px] md:text-[48px] font-bold leading-[1.1] text-primary-dark">
            {result.primaryValue}
          </span>
          <span className="text-[18px] font-medium text-text-secondary">{result.primaryUnit}</span>
        </div>
        <p className="mt-1 text-[15px] text-text-secondary">{result.primaryExplanation}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((item) => {
            const Icon = iconForStat(item.label, item.value);
            return (
              <div key={item.label} className="rounded-xl bg-bg p-4">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <p className="mt-2.5 font-mono text-[18px] font-semibold text-text-primary">
                  {item.value}
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-text-primary">
                  {item.label}
                </p>
                {item.description && (
                  <p className="mt-0.5 text-[12px] text-text-muted">{item.description}</p>
                )}
              </div>
            );
          })}
        </div>

        <details className="group mt-6 border-t border-border pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-semibold uppercase tracking-wide text-text-muted hover:text-primary">
            View Full Breakdown
            <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <dl className="mt-3">
            {result.breakdown.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0"
              >
                <dt className="text-[15px] text-text-secondary">
                  {row.label}
                  {row.note && <span className="ml-1 text-[13px] text-text-muted">({row.note})</span>}
                </dt>
                <dd className="font-mono text-[15px] font-medium text-text-primary">{row.value}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </div>
  );
}
