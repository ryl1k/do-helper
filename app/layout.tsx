import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "do-helper",
  description: "Upload exam photos, extract questions via OpenAI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
