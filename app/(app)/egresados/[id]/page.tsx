import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Screen } from "@/components/argos/screen";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Perfil de egresado" };

/**
 * Fase 0: la ruta existe para que el shell navegue. El id es un UUID (nunca
 * `id_interno`, §11). La ficha real —identidad, timeline de work_history,
 * contacto auditado y "Señales de Argos"— llega en la Fase 3.
 */
export default async function PerfilPage({ params }: { params: Promise<{ id: string }> }) {
  await params;

  return (
    <Screen>
      <Link
        href="/egresados"
        className="mb-5 inline-flex items-center gap-[7px] text-13.5 text-purple-600 hover:text-purple-900"
      >
        <ChevronLeft size={15} strokeWidth={2} aria-hidden />
        Volver a egresados
      </Link>
      <Card className="p-0">
        <EmptyState
          title="Perfil no disponible"
          description="Todavía no hay egresados cargados en este tenant."
        />
      </Card>
    </Screen>
  );
}
