import Link from "next/link";
import { Screen } from "@/components/argos/screen";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * 404. Un recurso de otro tenant también termina aquí: no se revela su
 * existencia (§10, "Sin permisos").
 */
export default function NotFound() {
  return (
    <Screen>
      <Card className="p-0">
        <EmptyState
          title="No encontramos esta página"
          description="Puede que el enlace haya cambiado o que el recurso no esté disponible para tu institución."
          action={
            <Link href="/dashboard" className="text-13.5 text-purple-600 hover:text-purple-900">
              Volver al dashboard
            </Link>
          }
        />
      </Card>
    </Screen>
  );
}
