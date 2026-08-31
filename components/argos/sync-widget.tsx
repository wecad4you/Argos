import { ProgressBar } from "@/components/ui/progress-bar";

/**
 * Widget de sincronización del sidebar. Muestra el último `import_run` real.
 * Si nunca se ha corrido una importación, muestra el estado vacío honesto —
 * no un progreso inventado (§1, §9).
 */
export interface SyncStatus {
  /** Registros enriquecidos en el período del último run. */
  enriched: number;
  /** Universo del run. */
  total: number;
  /** Fecha/hora ya formateada en es-CL por /lib/format. */
  syncedAtLabel: string;
}

export function SyncWidget({ status }: { status: SyncStatus | null }) {
  if (!status) {
    return (
      <div className="mt-auto rounded-widget border border-border-sidebar-widget bg-sidebar-widget p-4">
        <p className="text-13 leading-normal text-cream-50/65">
          Enriquecimiento del mes
          <br />
          Sin sincronizaciones aún
        </p>
      </div>
    );
  }

  const pct = status.total > 0 ? (status.enriched / status.total) * 100 : 0;

  return (
    <div className="mt-auto rounded-widget border border-border-sidebar-widget bg-sidebar-widget p-4">
      <p className="mb-3 text-13 leading-normal text-cream-50/65">
        Enriquecimiento del mes
        <br />
        <span className="tabular">
          {status.enriched} / {status.total}
        </span>{" "}
        registros
      </p>
      <ProgressBar
        value={pct}
        height={6}
        fill="lavender"
        track="on-navy"
        label="Avance del enriquecimiento del mes"
      />
      <p className="mt-3 flex items-center gap-[7px] text-12 text-purple-300/90">
        <span
          aria-hidden
          className="h-1.5 w-1.5 flex-none rounded-full bg-purple-300 animate-argosDot"
        />
        Sincronizado {status.syncedAtLabel}
      </p>
    </div>
  );
}
