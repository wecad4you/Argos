import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "soft" | "ghost";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  // Primario: purple-900 → hover purple-600.
  primary: "bg-purple-900 text-cream-50 font-medium hover:bg-purple-600 border border-transparent",
  // Secundario: blanco con borde; hover lleva borde y texto a purple-600.
  secondary:
    "bg-surface-card text-navy-900 border border-border-field hover:border-purple-600 hover:text-purple-600",
  // Suave: fondo de acento tenue; en hover se invierte.
  soft: "bg-surface-accent-soft text-purple-600 font-medium border border-transparent hover:bg-purple-600 hover:text-cream-50",
  ghost: "bg-transparent text-purple-600 border-0 p-0 hover:text-purple-900",
};

const SIZES: Record<Size, string> = {
  sm: "px-3.5 py-2 text-13 rounded-sm2",
  md: "px-4 py-2.5 text-13.5 rounded-input",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 cursor-pointer transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border-field disabled:hover:text-navy-900",
        variant !== "ghost" && SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
});
