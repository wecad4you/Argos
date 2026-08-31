"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Checkbox del panel de filtros: 15px, radio 4px, borde 1.5px.
 * Es un <input> real (oculto visualmente) para que funcione con teclado y
 * lectores de pantalla; el cuadro es la representación visual.
 */
export function Checkbox({
  label,
  count,
  checked,
  onChange,
  disabled = false,
  name,
}: {
  label: string;
  count?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  name?: string;
}) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-center gap-2.5 text-13.5 text-navy-900/75",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "flex h-[15px] w-[15px] flex-none items-center justify-center rounded-[4px] border-[1.5px] transition-colors",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-purple-600",
          checked ? "border-purple-600 bg-purple-600" : "border-border-checkbox bg-surface-card",
        )}
      >
        {checked ? <Check size={9} strokeWidth={3.5} className="text-white" /> : null}
      </span>
      <span className="flex-1">{label}</span>
      {count !== undefined ? <span className="num text-11.5 text-text-count">{count}</span> : null}
    </label>
  );
}
