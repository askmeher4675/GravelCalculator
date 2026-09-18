import { ButtonHTMLAttributes } from "react";

export function ResetButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="h-12 w-full cursor-pointer rounded-lg border border-border-strong text-[15px] font-semibold text-text-secondary transition-colors duration-200 hover:border-primary hover:text-primary hover:bg-bg active:scale-[0.98] md:w-auto md:px-6"
    >
      {props.children ?? "Reset"}
    </button>
  );
}
