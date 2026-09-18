import { ButtonHTMLAttributes } from "react";

export function CalculateButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...props}
      className="h-12 w-full cursor-pointer rounded-lg bg-primary text-[15px] font-semibold text-on-primary shadow-[var(--shadow-primary)] transition-all duration-200 hover:bg-primary-dark hover:shadow-md active:scale-[0.98] md:w-auto md:px-8"
    >
      {props.children ?? "Calculate"}
    </button>
  );
}
