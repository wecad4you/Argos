import "server-only";
import type { TenantSummary, SessionUser } from "@/components/argos/app-header";

export interface Session {
  user: SessionUser;
  tenant: TenantSummary;
}

/**
 * ÚNICO punto de resolución de sesión y tenant.
 *
 * Fase 0: no existe auth todavía. Esta función lee el tenant y el usuario de
 * variables de entorno para que el shell sea navegable, y falla en producción
 * si no están definidas — así nunca se cuela un tenant hardcodeado en un
 * build real.
 *
 * Fase 1: se reemplaza el cuerpo por Supabase Auth (magic link) leyendo
 * `tenant_id` del JWT y validando la membresía contra `memberships`. La firma
 * NO cambia: todo el resto de la app ya consume `getSession()`.
 *
 * El tenant SIEMPRE se resuelve en el servidor. El cliente nunca lo elige.
 */
export async function getSession(): Promise<Session> {
  const siglas = process.env.ARGOS_DEV_TENANT_SIGLAS;
  const name = process.env.ARGOS_DEV_TENANT_NAME;
  const fullName = process.env.ARGOS_DEV_USER_NAME;

  if (!siglas || !name || !fullName) {
    throw new Error(
      "Sesión no configurada. En Fase 0 el shell toma tenant y usuario de " +
        "ARGOS_DEV_TENANT_SIGLAS / ARGOS_DEV_TENANT_NAME / ARGOS_DEV_USER_NAME " +
        "(ver .env.example). En Fase 1 esto pasa a Supabase Auth.",
    );
  }

  return { user: { fullName }, tenant: { siglas, name } };
}
