import type { Metadata, Viewport } from "next";
import { instrumentSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Argos Alumni", template: "%s · Argos Alumni" },
  description: "Data enrichment & monitoring para la base de egresados.",
  // La plataforma es privada: no debe indexarse.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F7F2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={instrumentSans.variable}>
      <body className="font-sans bg-surface-app text-navy-900">{children}</body>
    </html>
  );
}
