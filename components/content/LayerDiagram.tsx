import type { CSSProperties } from "react";

type LayerTone = "fine" | "coarse" | "concrete" | "membrane" | "soil";

export interface DiagramLayer {
  name: string;
  /** Short thickness label shown on the right, e.g. "4–6 in". */
  depth: string;
  detail: string;
  tone: LayerTone;
  /** Representative thickness in inches; thicker layers get taller bands. */
  inches?: number;
}

// Swatch textures built from the palette primitives: speckled stone for aggregate (finer dots for
// finer stone), a flat fill for concrete, a dashed line for fabric or poly, and dark speckle for soil.
const TONE_STYLES: Record<LayerTone, CSSProperties> = {
  fine: {
    backgroundColor: "var(--p-neutral-200)",
    backgroundImage: "radial-gradient(circle, var(--p-neutral-500) 1.2px, transparent 1.7px)",
    backgroundSize: "7px 7px",
  },
  coarse: {
    backgroundColor: "var(--p-neutral-300)",
    backgroundImage: "radial-gradient(circle, var(--p-neutral-500) 3px, transparent 3.5px)",
    backgroundSize: "15px 13px",
  },
  concrete: {
    backgroundColor: "color-mix(in srgb, var(--p-neutral-500) 40%, var(--p-neutral-0))",
  },
  membrane: {
    background:
      "repeating-linear-gradient(90deg, var(--p-neutral-700) 0 6px, transparent 6px 10px) center / 100% 3px no-repeat, var(--p-neutral-0)",
  },
  soil: {
    backgroundColor: "color-mix(in srgb, var(--p-amber-600) 45%, var(--p-neutral-700))",
    backgroundImage: "radial-gradient(circle, rgb(0 0 0 / 0.2) 1px, transparent 1.5px)",
    backgroundSize: "9px 9px",
  },
};

const DEFAULT_HEIGHT: Record<LayerTone, number> = {
  fine: 52,
  coarse: 72,
  concrete: 64,
  membrane: 40,
  soil: 60,
};

/** A labeled cross-section: textured bands on the left, what each layer is on the right. */
export function LayerDiagram({ layers, caption }: { layers: DiagramLayer[]; caption: string }) {
  return (
    <figure className="mt-6">
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {layers.map((layer, i) => (
          <div
            key={layer.name}
            className={`flex ${i > 0 ? "border-t border-border" : ""}`}
            style={{
              minHeight: layer.inches ? Math.max(48, layer.inches * 14) : DEFAULT_HEIGHT[layer.tone],
            }}
          >
            <div className="w-16 shrink-0 sm:w-28" style={TONE_STYLES[layer.tone]} aria-hidden="true" />
            <div className="flex flex-1 items-center justify-between gap-3 px-4 py-2.5">
              <div>
                <p className="text-[15px] font-semibold text-text-primary">{layer.name}</p>
                <p className="mt-0.5 text-[14px] text-text-secondary">{layer.detail}</p>
              </div>
              <span className="shrink-0 font-mono text-[14px] font-semibold text-text-primary">{layer.depth}</span>
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-[14px] text-text-muted">{caption}</figcaption>
    </figure>
  );
}
