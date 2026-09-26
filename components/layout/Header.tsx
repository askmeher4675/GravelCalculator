import Link from "next/link";
import { PageContainer } from "./PageContainer";
import { MobileNav } from "./MobileNav";
import { CalculatorsMenu, type CalculatorMenuGroup } from "./CalculatorsMenu";
import { GridIcon } from "@/components/icons/Icons";
import { calculatorTaglines, calculatorsByCategory } from "@/lib/calculators";

// `wideOnly` links are hidden below xl so the row never wraps; they stay reachable via the calculators menu.
const NAV_LINKS = [
  { href: "/calculators/gravel-calculator", label: "Gravel Calculator" },
  { href: "/calculators/driveway-calculator", label: "Driveway Calculator", wideOnly: true },
  { href: "/calculators", label: "Calculators" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

const NAV_LINK_CLASS =
  "whitespace-nowrap rounded-md px-3.5 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:text-primary";

// Only the fields the menus render, so calculator logic stays out of the client bundle.
const MENU_GROUPS: CalculatorMenuGroup[] = calculatorsByCategory().map(([category, items]) => ({
  category,
  items: items.map((c) => ({ slug: c.slug, title: c.title, tagline: calculatorTaglines[c.slug] ?? "" })),
}));

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-sm">
      <PageContainer>
        <div className="relative flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Gravel Cost Calculator" className="h-10 w-auto md:h-11" />
          </Link>

          <nav className="hidden self-stretch md:flex items-center gap-1">
            {NAV_LINKS.map((link, i) =>
              link.href === "/calculators" ? (
                <CalculatorsMenu key={link.label} groups={MENU_GROUPS} triggerClassName={NAV_LINK_CLASS}>
                  {link.label}
                </CalculatorsMenu>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${
                    i === 0
                      ? "whitespace-nowrap rounded-md bg-primary px-3.5 py-2 text-[14px] font-semibold text-on-primary transition-colors hover:bg-primary-dark"
                      : NAV_LINK_CLASS
                  } ${link.wideOnly ? "hidden xl:block" : ""}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden self-stretch lg:flex">
            <CalculatorsMenu
              groups={MENU_GROUPS}
              triggerClassName="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2.5 text-[14px] font-semibold text-on-primary shadow-[var(--shadow-primary)] transition-colors hover:bg-primary-dark"
            >
              <GridIcon className="h-4 w-4" />
              All Calculators
            </CalculatorsMenu>
          </div>

          <MobileNav calculators={MENU_GROUPS.flatMap((g) => g.items)} />
        </div>
      </PageContainer>
    </header>
  );
}
