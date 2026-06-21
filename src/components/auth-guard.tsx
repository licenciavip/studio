"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useAuth, useFirestore, useDoc } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import type { UserDoc } from "@/lib/types";

// Rutas accesibles sin iniciar sesión
const PUBLIC_PATHS = ["/", "/login"];

/**
 * Protege el entorno de usuario normal.
 * - Sin sesión en ruta privada → /login
 * - Administrador en ruta de usuario → /admin
 * - Usuario bloqueado → cierra sesión
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  const userDocRef = useMemo(
    () => (firestore && user ? doc(firestore, "users", user.uid) : null),
    [firestore, user]
  );
  const { data: userDoc } = useDoc<UserDoc>(userDocRef);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      router.replace("/login");
      return;
    }
    if (user && isAdmin) {
      router.replace("/admin");
      return;
    }
    if (user && userDoc?.blocked) {
      signOut(auth);
    }
  }, [user, loading, isAdmin, isPublic, userDoc, auth, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }
  if (!user && !isPublic) return null;
  if (user && isAdmin) return null;
  if (user && userDoc?.blocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-bold text-danger">Tu cuenta está suspendida</p>
        <p className="text-[12px] text-on-surface/50">Contacta con soporte para más información.</p>
      </div>
    );
  }

  return <>{children}</>;
}
