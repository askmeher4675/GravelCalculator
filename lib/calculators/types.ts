export type FieldType = "number" | "select";

export interface SelectOption {
  value: number;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  unit: string;
  type: FieldType;
  placeholder?: string;
  helperText?: string;
  min?: number;
  step?: number;
  options?: SelectOption[];
  /** Only render/require this field when another field's value matches. */
  visibleIf?: { field: string; equals: number | number[] };
}

export interface BreakdownRow {
  label: string;
  value: string;
  note?: string;
}

export interface SecondaryResultItem {
  label: string;
  value: string;
}

export interface CalculationOutput {
  primaryValue: string;
  primaryUnit: string;
  primaryExplanation: string;
  secondary: SecondaryResultItem[];
  breakdown: BreakdownRow[];
  conversion?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedCalculatorRef {
  slug: string;
  title: string;
}

export interface RelatedGuideRef {
  href: string;
  title: string;
}

export interface CalculatorConfig {
  slug: string;
  title: string;
  category: string;
  intro: string;
  metaDescription: string;
  fields: FieldConfig[];
  wastePercentOptions?: number[];
  wastePercentDefault?: number;
  wasteHelperText?: string;
  calculate: (
    inputs: Record<string, number>,
    wastePercent: number,
  ) => CalculationOutput;
  methodology: string;
  example: string;
  faqs: FaqItem[];
  related: RelatedCalculatorRef[];
  relatedGuides?: RelatedGuideRef[];
}
