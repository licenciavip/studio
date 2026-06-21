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

  // El entorno administrativo tiene su propio layout (sidebar) y su propio
  // guard. AppShell no le aplica nada del marco de usuario.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return <>{children}</>;
  }

  // Landing y login: pantalla completa, sin chrome de usuario.
  if (CHROMELESS_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // Resto: entorno de usuario normal (protegido por AuthGuard).
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
