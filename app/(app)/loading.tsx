import { Screen } from "@/components/argos/screen";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton de pantalla con la geometría de una fila de KPIs + dos gráficos.
 * Cada pantalla define el suyo propio a medida que se implementa (Fase 3+).
 */
export default function Loading() {
  return (
    <Screen className="flex flex-col gap-5">
      <span className="sr-only" role="status">
        Cargando
      </span>
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="px-6 py-[22px]">
            <Skeleton height={13} width={120} />
            <Skeleton className="mt-3" height={40} width={140} />
            <Skeleton className="mt-2.5" height={12} width={100} />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-[1.15fr_1fr] items-start gap-4">
        <Card className="px-[26px] pb-7 pt-6">
          <Skeleton height={15} width={200} />
          <Skeleton className="mt-[22px] rounded-full" height={12} />
          <div className="mt-6 grid grid-cols-2 gap-x-[30px] gap-y-3">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} height={14} />
            ))}
          </div>
        </Card>
        <Card className="px-[26px] pb-7 pt-6">
          <Skeleton height={15} width={140} />
          <div className="mt-[22px] flex flex-col gap-[11px]">
            {Array.from({ length: 11 }, (_, i) => (
              <Skeleton key={i} height={8} className="rounded-full" />
            ))}
          </div>
        </Card>
      </div>
    </Screen>
  );
}
