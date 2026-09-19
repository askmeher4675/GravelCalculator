import { calculators } from "@/lib/calculators";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const GUIDES = [
  ["/guides/gravel-driveway", "How Much Gravel for a Driveway", "Depth and quantity by driveway size and traffic type."],
  ["/guides/gravel-cost-per-ton", "Gravel Cost Per Ton and Per Cubic Yard", "Price ranges, ton-to-yard conversion, and delivery costs."],
  ["/guides/gravel-coverage-chart", "Gravel Coverage Chart", "Square feet covered per ton and cubic yard at each depth."],
  ["/guides/gravel-types-and-sizes", "Gravel Types and Sizes", "Which gravel to use for driveways, paths, drainage, and bases."],
  ["/guides/concrete-slab-thickness", "Concrete Slab Thickness Guide", "Slab thickness for patios, walkways, driveways, and footings."],
  ["/guides/mulch-depth", "Mulch Depth by Plant Type", "How deep to mulch beds, tree rings, and vegetable gardens."],
];

export function GET() {
  const calcLines = Object.values(calculators).map(
    (c) => `- [${c.title}](${SITE_URL}/calculators/${c.slug}): ${c.metaDescription}`,
  );
  const guideLines = GUIDES.map(([path, title, desc]) => `- [${title}](${SITE_URL}${path}): ${desc}`);

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Each calculator shows its full math (volume, weight, waste allowance, and cost) rather than only a final number. Results are planning estimates; confirm quantities with your supplier before ordering.

## Calculators

${calcLines.join("\n")}

## Guides

${guideLines.join("\n")}

## About

- [Methodology](${SITE_URL}/methodology): Formulas, density assumptions, and waste factors behind every estimate.
- [About](${SITE_URL}/about): What this site is and who it is for.
- [Contact](${SITE_URL}/contact): Questions and corrections.
- [Disclaimer](${SITE_URL}/disclaimer): Why results are estimates, not order quantities or professional advice.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
