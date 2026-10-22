import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-brand to-[#ff6b8a] text-white shadow-md shadow-brand/30 enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg enabled:hover:shadow-brand/40",
  secondary:
    "border-[1.5px] border-line bg-surface text-ink enabled:hover:border-brand enabled:hover:text-brand",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full px-6 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}