"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { AdminSideNav } from "@/components/shell/AdminSideNav";
import { useSession } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session?.user) { setIsAdmin(false); return; }
    getSupabase()
      .from("profiles").select("is_admin").eq("id", session.user.id).maybeSingle()
      .then(({ data }) => setIsAdmin(!!data?.is_admin));
  }, [session?.user]);

  return (
    <div className="h-screen flex flex-col bg-canvas">
      <TopBar crumbs={[{ label: "Адмін", href: "/admin" }]} showSearch={false} />
      <div className="flex flex-1 min-h-0">
        <AdminSideNav />
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* Admin is desktop-only — keep the layout sane and feedback explicit on small screens. */}
          <div className="md:hidden p-6">
            <div className="panel p-8 text-center">
              <div className="text-[14px] font-medium">Адмін-панель — на десктопі</div>
              <p className="text-[12px] text-ink-dim mt-2 leading-relaxed">
                Інтерфейс редагування великий і вимагає миші. Відкрий цей URL на ноутбуці.
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            {loading || isAdmin === null ? (
              <div className="p-10 text-ink-mute text-sm">Перевіряємо доступ…</div>
            ) : !session ? (
              <NotSignedIn />
            ) : !isAdmin ? (
              <NotAdmin />
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function NotSignedIn() {
  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <div className="text-[20px] font-semibold tracking-tighter2">Потрібен вхід</div>
      <p className="text-[13px] text-ink-dim mt-2">Адмін-панель доступна лише авторизованим адмінам.</p>
      <Link href="/login" className="inline-block mt-5 px-4 py-2 rounded-md bg-cyan text-canvas text-[13px] font-semibold">
        Увійти
      </Link>
    </div>
  );
}

function NotAdmin() {
  return (
    <div className="max-w-md mx-auto py-20 text-center">
      <div className="text-[20px] font-semibold tracking-tighter2">Доступу немає</div>
      <p className="text-[13px] text-ink-dim mt-2">Твій акаунт не має прав адміністратора. Якщо це помилка — напиши власнику проєкту.</p>
      <Link href="/" className="inline-block mt-5 px-4 py-2 rounded-md border border-line text-[13px] text-ink-dim hover:text-ink hover:border-lineStrong">
        ← На головну
      </Link>
    </div>
  );
}
