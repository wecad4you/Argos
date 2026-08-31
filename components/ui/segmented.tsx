"use client";

import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

/** Segmented control del período en Alertas. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (next: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-segmented bg-surface-chip-strong p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "cursor-pointer rounded-sm2 px-[18px] py-2 text-13.5 transition-colors",
              active ? "bg-surface-card font-semibold text-purple-900" : "bg-transparent text-navy-900/60",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
