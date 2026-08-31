import type { Metadata } from "next";
import { Screen } from "@/components/argos/screen";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Configuración" };

/**
 * Mínimo funcional (miembros y roles, API keys, registro de importaciones)
 * está planificado para la Fase 5.
 */
export default function ConfiguracionPage() {
  return (
    <Screen>
      <EmptyState
        title="Configuración"
        description="Miembros del equipo, roles, API keys y el registro de importaciones se habilitan en la Fase 5."
      />
    </Screen>
  );
}
