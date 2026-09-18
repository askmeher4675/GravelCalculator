import { FieldConfig } from "@/lib/calculators/types";

interface CalculatorFieldProps {
  field: FieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

const stepperButtonClass =
  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border text-[18px] font-semibold text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-strong disabled:hover:text-text-secondary";

export function CalculatorField({ field, value, error, onChange }: CalculatorFieldProps) {
  if (field.type === "select") {
    return (
      <div>
        <label
          htmlFor={field.key}
          className="mb-2 block text-[13px] font-semibold uppercase tracking-wide text-text-secondary"
        >
          {field.label}
        </label>
        <select
          id={field.key}
          name={field.key}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${field.key}-error` : field.helperText ? `${field.key}-help` : undefined
          }
          className={`h-11 w-full rounded-lg border bg-surface px-3 text-[15px] text-text-primary outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary ${
            error ? "border-error" : "border-border-strong"
          }`}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {field.helperText && !error && (
          <p id={`${field.key}-help`} className="mt-1.5 text-[14px] text-text-muted">
            {field.helperText}
          </p>
        )}
        {error && (
          <p id={`${field.key}-error`} className="mt-1.5 text-[14px] text-error">
            {error}
          </p>
        )}
      </div>
    );
  }

  const step = field.step ?? 0.5;
  const min = field.min;

  const adjust = (direction: 1 | -1) => {
    const current = parseFloat(value);
    const base = Number.isFinite(current) ? current : (min ?? 0);
    let next = base + direction * step;
    if (min !== undefined) next = Math.max(min, next);
    const decimals = (String(step).split(".")[1] ?? "").length;
    onChange(next.toFixed(decimals).replace(/\.0+$/, ""));
  };

  const atMin = min !== undefined && parseFloat(value) <= min;

  return (
    <div>
      <label
        htmlFor={field.key}
        className="mb-2 block text-[13px] font-semibold uppercase tracking-wide text-text-secondary"
      >
        {field.label}
      </label>
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => adjust(-1)}
          disabled={value !== "" && atMin}
          aria-label={`Decrease ${field.label}`}
          className={`${stepperButtonClass} rounded-l-lg border-border-strong`}
        >
          −
        </button>
        <input
          id={field.key}
          name={field.key}
          type="number"
          inputMode="decimal"
          min={field.min}
          step={step}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${field.key}-error` : field.helperText ? `${field.key}-help` : undefined
          }
          className={`h-11 w-full min-w-0 border-y px-3 text-center text-[16px] text-text-primary outline-none transition-colors focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary ${
            error ? "border-error" : "border-border-strong"
          }`}
        />
        <span className="flex h-11 shrink-0 items-center border-y border-border-strong bg-bg px-3 text-[14px] font-medium text-text-secondary">
          {field.unit}
        </span>
        <button
          type="button"
          onClick={() => adjust(1)}
          aria-label={`Increase ${field.label}`}
          className={`${stepperButtonClass} rounded-r-lg border-border-strong`}
        >
          +
        </button>
      </div>
      {field.helperText && !error && (
        <p id={`${field.key}-help`} className="mt-1.5 text-[14px] text-text-muted">
          {field.helperText}
        </p>
      )}
      {error && (
        <p id={`${field.key}-error`} className="mt-1.5 text-[14px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}
