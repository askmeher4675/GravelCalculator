export type FieldType = "number";

export interface FieldConfig {
  key: string;
  label: string;
  unit: string;
  type: FieldType;
  placeholder: string;
  helperText?: string;
  min?: number;
  step?: number;
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

export interface CalculatorConfig {
  slug: string;
  title: string;
  category: string;
  intro: string;
  fields: FieldConfig[];
  wastePercentOptions?: number[];
  wastePercentDefault?: number;
  calculate: (
    inputs: Record<string, number>,
    wastePercent: number,
  ) => CalculationOutput;
  methodology: string;
  example: string;
  faqs: FaqItem[];
  related: RelatedCalculatorRef[];
}
