"use client";

import { useState } from "react";
import { CalculationOutput } from "@/lib/calculators/types";

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

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-[var(--shadow-md)]">
      <div className="h-1.5" style={{ background: "var(--gradient-hero)" }} />
      <div className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
          Result
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md border border-border-strong px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
        >
          {copyState === "copied" ? "Copied!" : copyState === "failed" ? "Couldn't copy" : "Copy result"}
        </button>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-[48px] md:text-[56px] font-bold leading-[1.1] text-primary-dark">
          {result.primaryValue}
        </span>
        <span className="text-[18px] font-medium text-text-secondary">{result.primaryUnit}</span>
      </div>
      <p className="mt-1 text-[16px] text-text-secondary">{result.primaryExplanation}</p>
      {result.conversion && (
        <p className="mt-1 text-[14px] text-text-muted">{result.conversion}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-3">
        {result.secondary.map((item) => (
          <div key={item.label}>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
              {item.label}
            </p>
            <p className="mt-1 font-mono text-[20px] font-semibold text-text-primary">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-text-muted">
          Breakdown
        </p>
        <dl>
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
      </div>
      </div>
    </div>
  );
}
