"use client";

import { useState } from "react";

interface WastePercentageSelectorProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

const CUSTOM_STEP = 0.5;

const customStepperButtonClass =
  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border text-[18px] font-semibold text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-text-secondary";

export function WastePercentageSelector({ options, value, onChange }: WastePercentageSelectorProps) {
  const [customMode, setCustomMode] = useState(!options.includes(value));

  const adjustCustom = (direction: 1 | -1) => {
    const base = Number.isFinite(value) ? value : 0;
    let next = base + direction * CUSTOM_STEP;
    next = Math.min(100, Math.max(0, next));
    onChange(Math.round(next * 2) / 2);
  };

  return (
    <div>
      <label className="mb-2 block text-[13px] font-semibold uppercase tracking-wide text-text-secondary">
        Waste %
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-border-strong overflow-hidden">
          {options.map((option, i) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setCustomMode(false);
                onChange(option);
              }}
              aria-pressed={!customMode && value === option}
              className={`h-11 cursor-pointer px-4 text-[15px] font-medium transition-colors duration-150 ${
                i !== 0 ? "border-l border-border-strong" : ""
              } ${
                !customMode && value === option
                  ? "bg-primary text-on-primary"
                  : "bg-surface text-text-secondary hover:bg-bg"
              }`}
            >
              {option}%
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustomMode(true)}
            aria-pressed={customMode}
            className={`h-11 cursor-pointer border-l border-border-strong px-4 text-[15px] font-medium transition-colors duration-150 ${
              customMode ? "bg-primary text-on-primary" : "bg-surface text-text-secondary hover:bg-bg"
            }`}
          >
            Custom
          </button>
        </div>

        {customMode && (
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={() => adjustCustom(-1)}
              disabled={value <= 0}
              aria-label="Decrease custom waste percentage"
              className={`${customStepperButtonClass} rounded-l-lg border-border-strong`}
            >
              −
            </button>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step={CUSTOM_STEP}
              value={value}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                onChange(Number.isFinite(num) ? Math.min(100, Math.max(0, num)) : 0);
              }}
              autoFocus
              aria-label="Custom waste percentage"
              className="h-11 w-20 min-w-0 border-y px-3 text-center text-[15px] text-text-primary outline-none transition-colors border-border-strong focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary"
            />
            <span className="flex h-11 shrink-0 items-center border-y border-border-strong bg-bg px-3 text-[14px] font-medium text-text-secondary">
              %
            </span>
            <button
              type="button"
              onClick={() => adjustCustom(1)}
              disabled={value >= 100}
              aria-label="Increase custom waste percentage"
              className={`${customStepperButtonClass} rounded-r-lg border-border-strong`}
            >
              +
            </button>
          </div>
        )}
      </div>
      <p className="mt-1.5 text-[14px] text-text-muted">
        Covers uneven ground, spillage, and compaction. 10% works for most projects.
      </p>
    </div>
  );
}
