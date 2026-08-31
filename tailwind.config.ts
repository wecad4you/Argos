import type { Config } from "tailwindcss";

/**
 * Tokens de diseño de Argos.
 *
 * Fuente de verdad: design_handoff_argos_alumni/README.md §"Design Tokens"
 * + PROMPT_ARGOS.md §6.
 *
 * Regla: ningún componente escribe un color literal. Todo pasa por estos
 * tokens. Los cinco colores base se declaran en formato de canales RGB
 * (ver app/globals.css) para que los modificadores de opacidad de Tailwind
 * funcionen — `text-navy-900/68` produce rgba(13,27,42,.68). Los alphas que
 * el handoff nombra explícitamente tienen además un token semántico.
 */

const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Paleta base ────────────────────────────────────────────────
        "purple-900": rgb("--argos-purple-900"), // #26215C
        "purple-600": rgb("--argos-purple-600"), // #534AB7
        "purple-300": rgb("--argos-purple-300"), // #AFA9EC
        "navy-900": rgb("--argos-navy-900"), //   #0D1B2A
        "cream-50": rgb("--argos-cream-50"), //   #F8F7F2

        // ── Tokens semánticos de texto ─────────────────────────────────
        "text-primary": rgb("--argos-navy-900"),
        "text-body": "rgba(13,27,42,.80)",
        "text-secondary": "rgba(13,27,42,.68)",
        "text-tertiary": "rgba(13,27,42,.55)",
        "text-muted": "rgba(13,27,42,.50)",
        "text-faint": "rgba(13,27,42,.45)",
        "text-disabled": "rgba(13,27,42,.40)",
        "text-annotation": "rgba(13,27,42,.40)",
        "text-count": "rgba(13,27,42,.38)",
        "text-rank": "rgba(13,27,42,.35)",
        "text-on-navy": "rgba(248,247,242,.72)",
        "text-on-navy-soft": "rgba(248,247,242,.60)",

        // ── Bordes ─────────────────────────────────────────────────────
        "border-card": "rgba(13,27,42,.08)",
        "border-field": "rgba(13,27,42,.14)",
        "border-header": "rgba(13,27,42,.09)",
        "border-divider": "rgba(13,27,42,.07)",
        "border-row": "rgba(13,27,42,.06)",
        "border-checkbox": "rgba(13,27,42,.24)",
        "border-accent-soft": "rgba(83,74,183,.30)",
        "border-unread": "rgba(83,74,183,.35)",
        "border-sidebar-widget": "rgba(175,169,236,.16)",

        // ── Superficies ────────────────────────────────────────────────
        "surface-app": rgb("--argos-cream-50"),
        "surface-card": "#FFFFFF",
        "surface-header": "rgba(248,247,242,.92)",
        "surface-table-head": "rgba(38,33,92,.04)",
        "surface-chip": "rgba(38,33,92,.06)",
        "surface-chip-strong": "rgba(38,33,92,.07)",
        "surface-track": "rgba(38,33,92,.09)",
        "surface-track-soft": "rgba(38,33,92,.08)",
        "surface-accent-soft": "rgba(83,74,183,.12)",
        "surface-accent-badge": "rgba(83,74,183,.13)",
        "hover-row": "rgba(175,169,236,.09)",

        // ── Sidebar (sobre navy) ───────────────────────────────────────
        "sidebar-active": "rgba(175,169,236,.16)",
        "sidebar-inactive": "rgba(248,247,242,.62)",
        "sidebar-widget": "rgba(175,169,236,.10)",
        "sidebar-track": "rgba(248,247,242,.12)",
      },

      // Escala de la barra apilada de seniority. 8 tonos para los 8 primeros
      // niveles del enum + gris neutro para "No identificado" (§7).
      // Se consume desde /lib/domain/seniority-scale.ts, no suelta en JSX.
      fontFamily: {
        sans: ["var(--font-instrument-sans)", "Helvetica", "Arial", "sans-serif"],
        // Georgia SOLO para el wordmark "Argos". Ningún otro serif en la app.
        wordmark: ["Georgia", "'Times New Roman'", "serif"],
      },

      fontSize: {
        // La escala del handoff usa medios píxeles; se respetan tal cual.
        "10.5": ["10.5px", { lineHeight: "1.3" }],
        "11": ["11px", { lineHeight: "1.4" }],
        "11.5": ["11.5px", { lineHeight: "1.4" }],
        "12": ["12px", { lineHeight: "1.4" }],
        "12.5": ["12.5px", { lineHeight: "1.45" }],
        "13": ["13px", { lineHeight: "1.45" }],
        "13.5": ["13.5px", { lineHeight: "1.45" }],
        "14": ["14px", { lineHeight: "1.45" }],
        "14.5": ["14.5px", { lineHeight: "1.45" }],
        "15": ["15px", { lineHeight: "1.5" }],
        "15.5": ["15.5px", { lineHeight: "1.5" }],
        "16": ["16px", { lineHeight: "1.5" }],
        "19": ["19px", { lineHeight: "1.3" }],
        "20": ["20px", { lineHeight: "1.3" }],
        "22": ["22px", { lineHeight: "1.2" }],
        "25": ["25px", { lineHeight: "1.2" }],
        "30": ["30px", { lineHeight: "1" }],
        "40": ["40px", { lineHeight: "1" }],
      },

      letterSpacing: {
        wordmark: "-.01em",
        "screen-title": "-.01em",
        "profile-name": "-.015em",
        kpi: "-.03em",
        label: ".07em",
        "label-wide": ".1em",
      },

      borderRadius: {
        chip: "6px",
        field: "7px",
        sm2: "8px",
        control: "9px",
        input: "10px",
        segmented: "11px",
        widget: "12px",
        alert: "13px",
        card: "14px",
        profile: "16px",
      },

      spacing: {
        sidebar: "236px",
        "filter-panel": "238px",
        "header-h": "69px",
      },

      keyframes: {
        argosFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "none" },
        },
        argosDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".25" },
        },
      },
      animation: {
        // Las únicas dos animaciones de la app (§6). Ambas se desactivan
        // bajo prefers-reduced-motion — ver app/globals.css.
        argosFade: "argosFade .3s ease-out both",
        argosDot: "argosDot 1.6s ease-in-out infinite",
      },

      // La app no usa sombras. Las tarjetas se separan por borde de 1px.
      boxShadow: { none: "none" },
    },
  },
  plugins: [],
};

export default config;
