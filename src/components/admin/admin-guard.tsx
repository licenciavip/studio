"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";

/**
 * Protege todas las rutas /admin.
 *
 * - Sin sesión        → /login
 * - Sesión sin admin  → /inicio
 * - Sesión con admin  → renderiza el panel
 *
 * No renderiza nada del panel hasta confirmar la claim `admin` (evita el
 * "flash" de contenido administrativo antes de validar).
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/inicio");
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0e14]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return <>{children}</>;
}
