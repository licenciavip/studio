"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/firebase";

// Solo para usuarios no autenticados (redirige a logged-in users)
const PUBLIC_PATHS = ["/login"];
// Accesibles para todos sin redirección (la página decide qué mostrar según auth)
const OPEN_PATHS = ["/"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const isOpen = OPEN_PATHS.includes(pathname);

  useEffect(() => {
    if (loading || isOpen) return;
    // Sin sesión y en ruta privada → al login
    if (!user && !isPublic) {
      router.replace("/login");
    }
    // Con sesión y en login → al inicio
    if (user && isPublic) {
      router.replace("/");
    }
  }, [user, loading, isPublic, isOpen, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }
  // Rutas abiertas siempre renderizan (la página maneja el estado de auth)
  if (isOpen) return <>{children}</>;
  if (!user && !isPublic) return null;
  if (user && isPublic) return null;

  return <>{children}</>;
}
