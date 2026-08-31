/**
 * Enums canónicos de Argos (PROMPT_ARGOS.md §7).
 *
 * IMPORTANTE: mandan los valores que produce el clasificador real
 * (`clasificar_seniority_area.py`), NO los del handoff de diseño. El orden de
 * estos arrays es significativo: define el orden de la barra apilada de
 * seniority y de su leyenda.
 *
 * Un valor fuera de estos enums es un ERROR de importación, nunca un valor
 * nuevo que se agregue solo.
 */

export const SENIORITY_LEVELS = [
  "C-Level",
  "Director",
  "Gerente",
  "Subgerente",
  "Jefatura",
  "Profesional Senior",
  "Profesional",
  "Trainee",
  "No identificado",
] as const;

export type Seniority = (typeof SENIORITY_LEVELS)[number];

/**
 * Áreas. En la lista del dashboard se ordenan por conteo descendente (no por
 * este orden), pero "Otro" va siempre al final aunque su conteo sea alto.
 */
export const AREAS = [
  "Gerencia General",
  "Emprendimiento",
  "Finanzas",
  "Marketing",
  "Ventas",
  "Tecnología",
  "RRHH",
  "Legal",
  "Operaciones",
  "Estrategia y Consultoría",
  "Otro",
] as const;

export type Area = (typeof AREAS)[number];

export const AREA_LAST: Area = "Otro";

export const MATCH_STATUSES = ["match_alto", "revisar", "no_encontrado"] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const ROLES = ["owner", "admin", "analyst", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export function isSeniority(value: string): value is Seniority {
  return (SENIORITY_LEVELS as readonly string[]).includes(value);
}

export function isArea(value: string): value is Area {
  return (AREAS as readonly string[]).includes(value);
}
