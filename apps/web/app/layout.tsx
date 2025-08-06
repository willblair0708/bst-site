import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";
import { LayoutWrapper } from "./layout-wrapper";

const satoshi = localFont({
  src: '../public/fonts/Satoshi-Variable.ttf',
  variable: '--font-satoshi',
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const jetbrainsMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: '--font-jetbrains-mono'
})

export const metadata: Metadata = {
  title: "Runix - The Operating System for Science",
  description: "Runix is a platform for versioning, composing, and collaborating on scientific knowledge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${satoshi.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}