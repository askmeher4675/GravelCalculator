import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/Icons";

export function GuideCard({
  title,
  description,
  href,
  image,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block h-56 overflow-hidden rounded-xl shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(20,8,4,0) 5%, rgba(20,8,4,0.55) 45%, rgba(20,8,4,0.95) 100%)" }}
        aria-hidden="true"
      />
      <span
        className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-on-primary shadow-[var(--shadow-sm)]"
        style={{ background: "var(--color-secondary)" }}
      >
        Guide
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
        <p className="text-[16px] font-bold text-white">{title}</p>
        <p className="mt-1 line-clamp-2 text-[13px] font-medium text-white/95">{description}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-white">
          Read Guide
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
