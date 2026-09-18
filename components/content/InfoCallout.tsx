import { ReactNode } from "react";

export function InfoCallout({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning";
}) {
  const borderColor = tone === "warning" ? "border-l-warning" : "border-l-info";
  return (
    <div className={`rounded-[6px] border-l-4 ${borderColor} bg-bg p-4 text-[15px] text-text-secondary`}>
      {children}
    </div>
  );
}
