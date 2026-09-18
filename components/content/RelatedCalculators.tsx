import Link from "next/link";
import { RelatedCalculatorRef } from "@/lib/calculators/types";

export function RelatedCalculators({ items }: { items: RelatedCalculatorRef[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/calculators/${item.slug}`}
          className="rounded-[6px] border border-border p-4 text-[15px] font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
