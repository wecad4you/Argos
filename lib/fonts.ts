import localFont from "next/font/local";

/**
 * Instrument Sans self-hosted (§2). Es una fuente variable: un solo archivo
 * cubre el eje de peso 400–700, así que no hay un woff2 por peso.
 * Georgia (wordmark) es fuente de sistema y no se carga.
 */
export const instrumentSans = localFont({
  src: [
    { path: "../public/fonts/InstrumentSans-latin.woff2", weight: "400 700", style: "normal" },
    { path: "../public/fonts/InstrumentSans-latin-ext.woff2", weight: "400 700", style: "normal" },
  ],
  variable: "--font-instrument-sans",
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});
