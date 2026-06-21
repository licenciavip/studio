"use client";

import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminShell } from "@/components/admin/admin-shell";

/**
 * Layout exclusivo del entorno administrativo.
 * Envuelve TODAS las rutas /admin con:
 *  - AdminGuard: exige custom claim `admin: true` (redirige si no).
 *  - AdminShell: sidebar + encabezado administrativos (sin chrome de usuario).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
