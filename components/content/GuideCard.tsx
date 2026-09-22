import Link from "next/link";
import { ReactNode } from "react";
import { RulerIcon } from "@/components/icons/Icons";
import { ArrowRightIcon } from "@/components/icons/Icons";

export function GuideCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div
        className="flex h-32 items-center justify-center text-on-primary"
        style={{ background: "var(--gradient-hero)" }}
        aria-hidden="true"
      >
        {icon ?? <RulerIcon className="h-9 w-9 opacity-90" />}
      </div>
      <div className="p-5">
        <p className="text-[17px] font-semibold text-text-primary">{title}</p>
        <p className="mt-1 text-[15px] text-text-secondary">{description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-[14px] font-medium text-primary">
          Read Guide
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
