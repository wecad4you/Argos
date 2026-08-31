import { ArgosMark } from "@/components/argos/argos-mark";
import { Wordmark } from "@/components/argos/wordmark";
import { SidebarNav } from "@/components/argos/sidebar-nav";
import { SyncWidget, type SyncStatus } from "@/components/argos/sync-widget";

export function Sidebar({
  unreadAlerts,
  syncStatus,
}: {
  unreadAlerts: number;
  syncStatus: SyncStatus | null;
}) {
  return (
    <aside className="sticky top-0 flex h-screen flex-col gap-[30px] bg-navy-900 px-4 py-[22px] text-cream-50">
      <div className="flex items-center gap-2.5 px-2">
        {/* Isotipo y wordmark son elementos separados. */}
        <ArgosMark variant="navy" size={26} />
        <Wordmark tone="cream" />
      </div>

      <SidebarNav unreadAlerts={unreadAlerts} />

      <SyncWidget status={syncStatus} />
    </aside>
  );
}
