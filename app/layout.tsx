import type { Metadata } from "next";
import { EB_Garamond, Hanken_Grotesk, Cormorant } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

const cormorant = Cormorant({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Toi",
  description: "Платформа премиальных онлайн-приглашений для тоя и семейных событий.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${ebGaramond.variable} ${hankenGrotesk.variable} ${cormorant.variable}`}>{children}</body>
    </html>
  );
}
