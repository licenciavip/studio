"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/firebase";

// Rutas accesibles sin iniciar sesión
const PUBLIC_PATHS = ["/login"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (loading) return;
    // Sin sesión y en ruta privada → al login
    if (!user && !isPublic) {
      router.replace("/login");
    }
    // Con sesión y en login → al inicio
    if (user && isPublic) {
      router.replace("/");
    }
  }, [user, loading, isPublic, router]);

  // Mientras carga el estado de auth, o mientras se va a redirigir, no mostramos nada
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }
  if (!user && !isPublic) return null;
  if (user && isPublic) return null;

  return <>{children}</>;
}
