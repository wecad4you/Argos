import type { Metadata } from "next";
import { Screen } from "@/components/argos/screen";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Alertas de cambio" };

/**
 * La tabla de eventos de cambio de trabajo en Clay está APAGADA (§4.3), así
 * que esta pantalla arranca vacía por diseño, no por falta de implementación.
 * El copy nombra la fecha de activación en cuanto la tengamos — hoy no la
 * tenemos, y no se inventa una.
 */
export default function AlertasPage() {
  return (
    <Screen className="flex flex-col gap-[18px]">
      <Card className="p-0">
        <EmptyState
          title="El monitoreo de cambios aún no está activo"
          description="No hay señales registradas todavía. Cuando se encienda la detección de cambios de trabajo, cada evento aparecerá aquí y en el feed del dashboard."
        />
      </Card>
    </Screen>
  );
}
