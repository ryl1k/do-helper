import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "do-helper · Дослідження операцій",
  description: "Study and quiz yourself on Operations Research exam questions.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Inline pre-hydration script: applies the saved/system theme to <html>
// BEFORE first paint to avoid a flash. Must stay tiny and self-contained.
const themeBootstrap = `
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.toggle('dark', t === 'dark');
  } catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
