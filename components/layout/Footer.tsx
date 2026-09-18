import Link from "next/link";
import { PageContainer } from "./PageContainer";

const CALCULATORS = [
  "Gravel Calculator",
  "Concrete Calculator",
  "Mulch Calculator",
  "Topsoil Calculator",
  "Paver Calculator",
  "Sod Calculator",
  "Fence Calculator",
  "Paint Calculator",
  "Deck Calculator",
  "Driveway Calculator",
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="h-1" style={{ background: "var(--gradient-hero)" }} />
      <PageContainer>
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-3">
              Calculators
            </p>
            <ul className="space-y-2">
              {CALCULATORS.map((name) => (
                <li key={name}>
                  <Link
                    href={`/calculators/${name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-[14px] text-text-secondary transition-colors hover:text-primary"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-3">
              Company
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-text-muted mb-3">
              Legal
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-[14px] text-text-secondary transition-colors hover:text-primary">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 text-[13px] text-text-muted">
          Estimates are based on standard material assumptions and should be used as a planning guide, not a final order quantity.
        </div>
      </PageContainer>
    </footer>
  );
}
