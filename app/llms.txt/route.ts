import { calculators } from "@/lib/calculators";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const GUIDES = [
  ["/guides/gravel-driveway", "How Much Gravel for a Driveway", "Depth by use and soil, how base and surface layers work, tons for common driveway sizes, and a step-by-step build."],
  ["/guides/gravel-cost-per-ton", "Gravel Cost Per Ton and Per Cubic Yard", "Price ranges, ton-to-yard conversion, delivery costs, bulk vs bagged gravel, and a worked driveway budget."],
  ["/guides/gravel-coverage-chart", "Gravel Coverage Chart", "Square feet covered per cubic yard, ton, and bag at each depth, plus metric coverage."],
  ["/guides/gravel-types-and-sizes", "Gravel Types and Sizes", "Crushed stone numbers explained, and which gravel to use for driveways, drainage, pavers, and paths."],
  ["/guides/concrete-slab-thickness", "Concrete Slab Thickness Guide", "Slab thickness by use, base and vapor retarder, reinforcement, control joints, and how much concrete to order."],
  ["/guides/mulch-depth", "Mulch Depth by Plant Type", "How deep to mulch beds, trees, and vegetable gardens, coverage per bag and yard, and mulch types."],
  ["/guides/gravel-under-concrete-slab", "How Much Gravel Under a Concrete Slab", "Base depth by project, which stone to use, and the cubic yards and tons of gravel for common slab sizes."],
  ["/guides/concrete-walkway-path", "How Much Concrete for a Walkway or Path", "Concrete by length, width and thickness, plus joints, gravel base, slope, and a worked example."],
  ["/guides/driveway-slope-and-grade", "Driveway Slope and Grade", "How to calculate slope from rise and run, a percent-degrees-ratio chart, how steep is too steep, and crown for drainage."],
  ["/guides/pea-gravel-coverage", "Pea Gravel Coverage Chart", "Square feet covered by a ton, cubic yard, or bag of pea gravel at each depth, tons for common areas, and best uses."],
  ["/guides/deck-cost-breakdown", "Deck Cost Breakdown", "Every line item in a deck materials estimate, a worked 16 by 12 ft example, material comparison, and ways to save."],
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
