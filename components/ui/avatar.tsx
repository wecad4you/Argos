import { avatarTone } from "@/lib/domain/palette";
import { cn } from "@/lib/utils";

/**
 * Avatar de egresado.
 *
 * v1 usa SIEMPRE iniciales sobre la rotación de 5 tonos: NO se hotlinkean las
 * fotos de LinkedIn (las URLs del CDN expiran y hay implicancias de
 * privacidad, §15). El prop `photoUrl` existe para cuando definamos proxy y
 * caché propios; hoy se ignora deliberadamente.
 */
export function AlumniAvatar({
  name,
  seed,
  size = 34,
  photoUrl: _photoUrl,
  className,
}: {
  name: string;
  seed?: string | number;
  size?: number;
  photoUrl?: string | null;
  className?: string;
}) {
  const initials = getInitials(name);
  return (
    <span
      aria-hidden
      className={cn("flex flex-none items-center justify-center rounded-full font-semibold text-white", className)}
      style={{
        width: size,
        height: size,
        background: avatarTone(seed ?? name),
        fontSize: Math.round(size * 0.35),
      }}
    >
      {initials}
    </span>
  );
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? (parts[1]?.[0] ?? "") : "";
  return (first + second).toUpperCase();
}
