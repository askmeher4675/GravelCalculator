"use client";

import { useState } from "react";
import { FaqItem } from "@/lib/calculators/types";

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
            >
              <span className={`text-[17px] font-semibold transition-colors group-hover:text-primary ${isOpen ? "text-primary" : "text-text-primary"}`}>{item.question}</span>
              <span
                className={`shrink-0 text-primary transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>
            {isOpen && (
              <p className="pb-4 text-[16px] text-text-secondary">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
