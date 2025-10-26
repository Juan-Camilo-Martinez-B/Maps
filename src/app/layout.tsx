import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fitness Tracker - Tu Compañero de Entrenamiento",
  description: "Aplicación profesional de seguimiento de actividades físicas con mapas, estadísticas y exportación de rutas GPX",
  keywords: ["fitness", "running", "cycling", "walking", "gps", "tracker", "maps"],
  authors: [{ name: "Fitness Tracker Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Fitness Tracker",
    description: "Tu compañero perfecto para entrenar",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
