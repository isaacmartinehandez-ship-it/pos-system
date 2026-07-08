import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POS System - SimplyGest Clone",
  description: "Sistema de punto de venta similar a SimplyGest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
