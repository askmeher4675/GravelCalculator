import { formatDate, pageDates } from "@/lib/site";

export function LastUpdated({ path }: { path: string }) {
  const { modified } = pageDates(path);
  return (
    <p className="mt-2 text-[14px] text-text-muted">
      Last updated <time dateTime={modified}>{formatDate(modified)}</time>
    </p>
  );
}
