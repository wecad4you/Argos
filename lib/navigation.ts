import type { LucideIcon } from "lucide-react";
import { Bell, LayoutDashboard, Settings, TrendingUp, Users } from "lucide-react";

/** Rutas de la app y su título de pantalla (el header lo lee de aquí). */
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** El item queda activo también en sus rutas hijas (perfil de egresado). */
  matchPrefix: boolean;
  /** Solo Alertas muestra badge de conteo sin revisar; se oculta si es 0. */
  showsUnreadBadge?: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, matchPrefix: false },
  { href: "/egresados", label: "Egresados", icon: Users, matchPrefix: true },
  { href: "/alertas", label: "Alertas", icon: Bell, matchPrefix: false, showsUnreadBadge: true },
  { href: "/reportes", label: "Reportes", icon: TrendingUp, matchPrefix: false },
  { href: "/configuracion", label: "Configuración", icon: Settings, matchPrefix: false },
] as const;

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/egresados": "Egresados",
  "/alertas": "Alertas de cambio",
  "/reportes": "Reportes",
  "/configuracion": "Configuración",
};

export function screenTitle(pathname: string): string {
  if (pathname.startsWith("/egresados/")) return "Perfil de egresado";
  return TITLES[pathname] ?? "Argos";
}
