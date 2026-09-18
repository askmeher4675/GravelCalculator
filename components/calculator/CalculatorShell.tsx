"use client";

import { FormEvent, useState } from "react";
import { CalculationOutput } from "@/lib/calculators/types";
import { calculators } from "@/lib/calculators";
import { CalculatorField } from "./CalculatorField";
import { WastePercentageSelector } from "./WastePercentageSelector";
import { CalculateButton } from "./CalculateButton";
import { ResetButton } from "./ResetButton";
import { ResultPanel } from "./ResultPanel";

function defaultValues(config: (typeof calculators)[string]) {
  return Object.fromEntries(
    config.fields.map((f) => [f.key, f.type === "select" ? String(f.options?.[0]?.value ?? "") : ""]),
  );
}

export function CalculatorShell({ slug }: { slug: string }) {
  const config = calculators[slug];
  const [values, setValues] = useState<Record<string, string>>(() => defaultValues(config));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [wastePercent, setWastePercent] = useState(config.wastePercentDefault ?? 10);
  const [result, setResult] = useState<CalculationOutput | null>(null);
  const [resetCount, setResetCount] = useState(0);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const parsed: Record<string, number> = {};

    for (const field of config.fields) {
      const raw = values[field.key];
      const num = parseFloat(raw);
      if (raw === "" || Number.isNaN(num)) {
        nextErrors[field.key] = `Enter a ${field.label.toLowerCase()}`;
      } else if (num <= 0) {
        nextErrors[field.key] = `${field.label} must be greater than 0`;
      } else {
        parsed[field.key] = num;
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setResult(null);
      return;
    }

    setResult(config.calculate(parsed, wastePercent));
  }

  function handleReset() {
    setValues(defaultValues(config));
    setErrors({});
    setWastePercent(config.wastePercentDefault ?? 10);
    setResult(null);
    setResetCount((c) => c + 1);
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-[8px] border border-border bg-surface p-6 md:p-8"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {config.fields.map((field) => (
            <CalculatorField
              key={field.key}
              field={field}
              value={values[field.key]}
              error={errors[field.key]}
              onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
            />
          ))}
        </div>

        {config.wastePercentOptions && (
          <div className="mt-6">
            <WastePercentageSelector
              key={resetCount}
              options={config.wastePercentOptions}
              value={wastePercent}
              onChange={setWastePercent}
              helperText={config.wasteHelperText}
            />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <CalculateButton />
          <ResetButton onClick={handleReset} />
        </div>
      </form>

      {result && <ResultPanel result={result} />}
    </div>
  );
}
