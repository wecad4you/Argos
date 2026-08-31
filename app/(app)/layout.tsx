import { Sidebar } from "@/components/argos/sidebar";
import { AppHeader } from "@/components/argos/app-header";
import { getSession } from "@/lib/auth/session";

/**
 * Shell de la aplicación: grid 236px 1fr, sidebar navy sticky + header sticky.
 *
 * Fase 0: no hay base de datos, así que el conteo de alertas sin revisar es 0
 * (el badge no se dibuja) y el widget de sincronización muestra "Sin
 * sincronizaciones aún". Ambos valores pasan a consultarse en Fase 3/4 — no
 * se inventa ningún número intermedio.
 */
// Todo el portal depende de la sesión (tenant + usuario): es dinámico por
// definición y no se prerenderiza en build.
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="grid min-h-screen grid-cols-[236px_1fr] bg-surface-app">
      <Sidebar unreadAlerts={0} syncStatus={null} />
      <main className="flex min-w-0 flex-col">
        <AppHeader tenant={session.tenant} user={session.user} />
        {children}
      </main>
    </div>
  );
}
