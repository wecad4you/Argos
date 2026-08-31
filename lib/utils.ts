/** Concatena clases ignorando falsy. Evita una dependencia externa. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
