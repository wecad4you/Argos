import type { Metadata } from "next";
import { Screen } from "@/components/argos/screen";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Fase 0: la ruta existe y entra con `argosFade`, pero no hay base de datos.
 * No se dibujan KPIs con cifras: cada número de esta pantalla se calcula desde
 * Postgres, scopeado por tenant y filtros (Fase 3). Mostrar 42.317 o cualquier
 * cifra del prototipo aquí sería exactamente lo que §1 prohíbe.
 */
export default function DashboardPage() {
  return (
    <Screen className="flex flex-col gap-5">
      <Card className="p-0">
        <EmptyState
          title="Aún no hay datos cargados"
          description="Los KPIs, la distribución por seniority, el área de trabajo y el feed de cambios se calculan desde la base del tenant. La carga de las tablas de Clay ocurre en la Fase 2."
        />
      </Card>
    </Screen>
  );
}
