import { cn } from "@/lib/utils";

/**
 * Wordmark "Argos". Es el ÚNICO lugar de la app donde se usa serif (Georgia).
 * Es texto, no imagen, y es un elemento separado del isotipo.
 */
export function Wordmark({
  className,
  tone = "cream",
}: {
  className?: string;
  tone?: "cream" | "purple";
}) {
  return (
    <span
      className={cn(
        "font-wordmark text-22 tracking-wordmark",
        tone === "cream" ? "text-cream-50" : "text-purple-900",
        className,
      )}
    >
      Argos
    </span>
  );
}
