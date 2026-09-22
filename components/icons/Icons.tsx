import { ReactElement, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MountainIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 19h18L14.5 7 10 14l-2.5-3L3 19Z" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function CalcIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 3c0 9-6 15-15 15H3v-3C3 6 9 3 21 3Z" />
      <path d="M3 21c3-5 7-8 12-12" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3-6 7-6s7 2.7 7 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M22 20c0-2.6-2-4.8-4.5-5.5" />
    </svg>
  );
}

export function CubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />
      <path d="M3 7l9 5 9-5M12 12v10" />
    </svg>
  );
}

export function ScaleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0L5 7Zm14 0l-3 6a3 3 0 0 0 6 0l-3-6Z" />
    </svg>
  );
}

export function DollarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2v20M17 6.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5 2.2 3 5 3.5c2.8.5 5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8h12l1.2 12.2a1 1 0 0 1-1 1.8H5.8a1 1 0 0 1-1-1.8L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function RoadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 3 4 21M16 3l4 18M12 5v3m0 4v3m0 4v1" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
    </svg>
  );
}

export function RulerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(-8 12 12)" />
      <path d="M7 9.5 6.6 12M11 9 10.6 11.5M15 8.5 14.6 11" />
    </svg>
  );
}

export function FenceIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3v18M6 3l3 3-3 3M18 3v18M18 3l-3 3 3 3M3 9h18M3 15h18" />
    </svg>
  );
}

export function PaintIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 3 5 12a3.5 3.5 0 0 0 5 5l9-9-5-5Z" />
      <path d="m17 6 1 1M5 19h5" />
    </svg>
  );
}

export function DeckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h18M3 6v14M21 6v14M3 20h18M7 6v14M11 6v14M15 6v14M19 6v14" />
    </svg>
  );
}

export function SodIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 20c2-3 4-3 6 0 2-3 4-3 6 0 2-3 4-3 6 0" />
      <path d="M6 20V9M12 20v-6M18 20V9" />
    </svg>
  );
}

const CALCULATOR_ICONS: Record<string, (props: IconProps) => ReactElement> = {
  "gravel-calculator": CubeIcon,
  "driveway-calculator": RoadIcon,
  "concrete-calculator": LayersIcon,
  "mulch-calculator": LeafIcon,
  "topsoil-calculator": SodIcon,
  "paver-calculator": GridIcon,
  "sod-calculator": SodIcon,
  "fence-calculator": FenceIcon,
  "paint-calculator": PaintIcon,
  "deck-calculator": DeckIcon,
};

export function CalculatorIcon({ slug, ...props }: IconProps & { slug: string }) {
  const Icon = CALCULATOR_ICONS[slug] ?? CubeIcon;
  return <Icon {...props} />;
}
