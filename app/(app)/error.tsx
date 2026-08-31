"use client";

import { Screen } from "@/components/argos/screen";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Error de API/render: tarjeta con mensaje breve + Reintentar.
 * Nunca una pantalla en blanco ni un stack trace (§10). El detalle del error
 * no se muestra al usuario ni se registra con datos personales (§12.7).
 */
export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Screen>
      <Card className="p-0">
        <EmptyState
          title="No pudimos cargar esta pantalla"
          description="Ocurrió un problema al consultar los datos."
          action={
            <Button variant="secondary" size="sm" onClick={reset}>
              Reintentar
            </Button>
          }
        />
      </Card>
    </Screen>
  );
}
