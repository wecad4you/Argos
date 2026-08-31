import { SENIORITY_LEVELS, type Seniority } from "./enums";

/**
 * Escalas de color derivadas de los tokens. Viven en dominio (no en JSX)
 * porque el mapeo nivel → tono es una regla, no una decisión de cada vista.
 */

/** 8 tonos del handoff para los 8 primeros niveles + gris neutro para el 9º. */
const SENIORITY_SCALE = [
  "#26215C",
  "#3B3392",
  "#534AB7",
  "#6A62C4",
  "#8079D0",
  "#9992DD",
  "#AFA9EC",
  "#CFCBF4",
] as const;

/** "No identificado" siempre en gris neutro y siempre al final. */
const SENIORITY_UNKNOWN_TONE = "rgba(13,27,42,.18)";

export const SENIORITY_TONES: Readonly<Record<Seniority, string>> = Object.fromEntries(
  SENIORITY_LEVELS.map((level, i) => [level, SENIORITY_SCALE[i] ?? SENIORITY_UNKNOWN_TONE]),
) as Record<Seniority, string>;

/** Rotación de 5 tonos para avatares de iniciales (§15). */
export const AVATAR_TONES = ["#26215C", "#534AB7", "#7C74C9", "#0D1B2A", "#8079D0"] as const;

/** Tono estable por índice o por una llave textual (id del egresado). */
export function avatarTone(seed: number | string): string {
  const n =
    typeof seed === "number"
      ? seed
      : Array.from(seed).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return AVATAR_TONES[Math.abs(n) % AVATAR_TONES.length] as string;
}
