"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Navegación del sidebar. `unreadAlerts` viene del servidor
 * (count(seen_at is null) del período por defecto). Si es 0 el badge NO se
 * muestra — no se pinta un cero (§4.3).
 */
export function SidebarNav({ unreadAlerts }: { unreadAlerts: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-[3px]" aria-label="Navegación principal">
      {NAV_ITEMS.map((item) => {
        const active = item.matchPrefix
          ? pathname === item.href || pathname.startsWith(`${item.href}/`)
          : pathname === item.href;
        const Icon = item.icon;
        const badge = item.showsUnreadBadge && unreadAlerts > 0 ? unreadAlerts : null;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex w-full items-center gap-[11px] rounded-control px-3 py-2.5 text-14.5 transition-colors",
              active
                ? "bg-sidebar-active font-semibold text-cream-50"
                : "bg-transparent font-normal text-sidebar-inactive hover:text-cream-50",
            )}
          >
            <span className="flex w-[18px] justify-center opacity-90">
              <Icon size={17} strokeWidth={1.8} aria-hidden />
            </span>
            <span className="flex-1">{item.label}</span>
            {badge !== null ? (
              <Badge tone="solid" className="text-11.5">
                <span className="tabular">{badge}</span>
                <span className="sr-only"> alertas sin revisar</span>
              </Badge>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
