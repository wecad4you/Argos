import type { Metadata } from "next";
import { Screen } from "@/components/argos/screen";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Egresados" };

/**
 * Fase 0: sin datos no hay facetas de filtro ni filas. El panel de filtros,
 * la paginación server-side y el orden llegan en la Fase 3, con los conteos
 * calculados en el backend.
 */
export default function EgresadosPage() {
  return (
    <Screen className="flex flex-col gap-5">
      <Card className="p-0">
        <EmptyState
          title="La base de egresados está vacía"
          description="La tabla, sus filtros con facetas y el ranking de empresas se llenan tras la ingesta de las tablas de Clay (Fase 2)."
        />
      </Card>
    </Screen>
  );
}
