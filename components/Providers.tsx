"use client";
import { usePathname } from "next/navigation";
import { I18nProvider } from "@/lib/i18n";
import { ToastProvider } from "@/components/states/Toast";
import { SignInNudge } from "@/components/SignInNudge";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  // Quiet on auth + admin routes; everywhere else the nudge can appear once.
  const noNudge = pathname.startsWith("/login") || pathname.startsWith("/admin");
  return (
    <I18nProvider>
      <ToastProvider>
        {children}
        {!noNudge && <SignInNudge />}
      </ToastProvider>
    </I18nProvider>
  );
}
