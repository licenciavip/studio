"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/firebase";

// Rutas accesibles sin iniciar sesión
const PUBLIC_PATHS = ["/", "/login"];

/**
 * Protege el entorno de usuario normal.
 *
 * - Sin sesión en ruta privada → /login
 * - Administrador en ruta de usuario → /admin (no debe usar la app de usuario)
 *
 * Nota: el entorno /admin no pasa por aquí; tiene su propio AdminGuard.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      router.replace("/login");
      return;
    }
    // El administrador no debe entrar al entorno de usuario.
    if (user && isAdmin) {
      router.replace("/admin");
    }
  }, [user, loading, isAdmin, isPublic, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }
  if (!user && !isPublic) return null;
  if (user && isAdmin) return null;

  return <>{children}</>;
}
