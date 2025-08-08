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
  openGraph: {
    title: "Runix - The Operating System for Science",
    description: "Versioned, composable, verifiable science.",
    url: "https://runix.example.com",
    siteName: "Runix",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "Runix" }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Runix - The Operating System for Science",
    description: "Versioned, composable, verifiable science.",
    images: ["/og.png"],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash: set initial theme class before hydration; default to light unless user chose dark */}
        <script
          id="no-flash-theme"
          dangerouslySetInnerHTML={{
            __html: `(() => { try {
              const root = document.documentElement;
              const stored = localStorage.getItem('theme');
              const isDark = stored === 'dark';
              if (isDark) root.classList.add('dark'); else root.classList.remove('dark');
            } catch {} })();`
          }}
        />
        {/* Ensure background is light before CSS loads to avoid black flash */}
        <style id="pretheme-bg">{`html,body{background:#F4F4F2}`}</style>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${satoshi.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}