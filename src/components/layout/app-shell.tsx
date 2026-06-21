"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AuthGuard } from "@/components/auth-guard";

// Rutas que se muestran SIN el marco de la app (landing y autenticación):
// ocupan toda la pantalla, sin header fijo ni barra inferior.
const CHROMELESS_PATHS = ["/", "/login"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (CHROMELESS_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="lg-scroll-edge" aria-hidden />
      <Header />
      <main className="flex-1 w-full mx-auto max-w-[var(--content-max-width)] px-4 sm:px-6 pb-28 pt-[calc(5rem+env(safe-area-inset-top))]">
        <AuthGuard>{children}</AuthGuard>
      </main>
      <BottomNav />
    </div>
  );
}
