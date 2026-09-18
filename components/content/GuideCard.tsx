import Link from "next/link";

export function GuideCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <p className="text-[17px] font-semibold text-text-primary">{title}</p>
      <p className="mt-1 text-[15px] text-text-secondary">{description}</p>
    </Link>
  );
}
