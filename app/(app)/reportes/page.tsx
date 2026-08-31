import type { Metadata } from "next";
import { Screen } from "@/components/argos/screen";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Reportes" };

/** Módulo sin diseño. Queda como el estado vacío del prototipo (§9). */
export default function ReportesPage() {
  return (
    <Screen>
      <EmptyState title="Reportes" description="Módulo fuera del alcance de este prototipo." />
    </Screen>
  );
}
