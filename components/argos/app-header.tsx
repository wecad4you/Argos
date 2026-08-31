"use client";

import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/components/ui/avatar";
import { screenTitle } from "@/lib/navigation";

export interface TenantSummary {
  /** Siglas para el cuadro del pill: 'UDD'. */
  siglas: string;
  /** Nombre completo: 'Universidad del Desarrollo'. */
  name: string;
}

export interface SessionUser {
  fullName: string;
}

/**
 * Header sticky. El pill de tenant y el de usuario se leen de la sesión —
 * nunca se hardcodean (§9).
 * Es la única superficie de la app con `backdrop-filter`; no hay sombras.
 */
export function AppHeader({ tenant, user }: { tenant: TenantSummary; user: SessionUser }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-border-header bg-surface-header px-8 py-4 backdrop-blur-[12px]">
      <div className="flex min-w-0 items-center gap-3.5">
        <h1 className="text-20 font-semibold tracking-screen-title text-navy-900">
          {screenTitle(pathname)}
        </h1>
        <span aria-hidden className="h-5 w-px bg-navy-900/[.14]" />
        <div className="flex items-center gap-2.5 rounded-full bg-surface-chip py-[5px] pl-[6px] pr-3">
          {/* Cuadro de 22px del handoff, pero con min-width en vez de width fija:
              siglas de 3+ letras ("UDD", "UNAB") desbordan una caja rígida. */}
          <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-chip bg-purple-900 px-1 text-11 font-bold tracking-tight text-cream-50">
            {tenant.siglas}
          </span>
          <span className="text-13.5 text-purple-900">{tenant.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* La exportación real (con filtros + auditoría) llega en la Fase 5. */}
        <Button variant="secondary" size="sm" disabled title="Disponible con datos cargados">
          <Download size={15} strokeWidth={1.8} aria-hidden />
          Exportar
        </Button>
        <div className="flex items-center gap-2.5 rounded-full border border-border-field bg-surface-card py-[5px] pl-[5px] pr-3">
          <span
            aria-hidden
            className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-purple-600 text-11.5 font-semibold text-cream-50"
          >
            {getInitials(user.fullName)}
          </span>
          <span className="text-13.5 text-navy-900">{user.fullName}</span>
        </div>
      </div>
    </header>
  );
}
