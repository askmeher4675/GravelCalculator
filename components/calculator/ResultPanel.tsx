import { CalculationOutput } from "@/lib/calculators/types";

export function ResultPanel({ result }: { result: CalculationOutput }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-elevated shadow-[var(--shadow-md)]">
      <div className="h-1.5" style={{ background: "var(--gradient-hero)" }} />
      <div className="p-6 md:p-8">
      <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">
        Result
      </p>

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
