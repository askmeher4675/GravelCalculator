// Shared "area shape" support used by calculators that turn a footprint into a volume or coverage figure.
// Field keys are fixed across calculators (length/width, diameter, base/triangleHeight,
// outerDiameter/innerDiameter, lengthA/lengthB/trapWidth) so calculate() logic can be reused as-is.

export const SHAPES = [
  { id: 1, label: "Rectangle / Square" },
  { id: 2, label: "Circle" },
  { id: 3, label: "Triangle" },
  { id: 4, label: "Circular ring (path)" },
  { id: 5, label: "Trapezoid" },
];

export function shapeLabel(shape: number): string {
  return SHAPES.find((s) => s.id === shape)?.label ?? SHAPES[0].label;
}

export function shapeAreaSqFt(shape: number, i: Record<string, number>): number {
  switch (shape) {
    case 2: {
      const r = i.diameter / 2;
      return Math.PI * r * r;
    }
    case 3:
      return 0.5 * i.base * i.triangleHeight;
    case 4: {
      const outerR = i.outerDiameter / 2;
      const innerR = i.innerDiameter / 2;
      return Math.PI * (outerR * outerR - innerR * innerR);
    }
    case 5:
      return ((i.lengthA + i.lengthB) / 2) * i.trapWidth;
    default:
      return i.length * i.width;
  }
}

export function shapeAreaFormulaLabel(shape: number, i: Record<string, number>): string {
  switch (shape) {
    case 2:
      return `Area (π × (${(i.diameter / 2).toFixed(1)} ft radius)²)`;
    case 3:
      return `Area (½ × ${i.base.toFixed(1)} × ${i.triangleHeight.toFixed(1)} ft)`;
    case 4:
      return `Area (π × (outer² − inner²) radius)`;
    case 5:
      return `Area (avg width × height, trapezoid)`;
    default:
      return "Area";
  }
}
