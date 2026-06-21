"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { ChevronRight } from "lucide-react";
import { PageHeader, AdminCard, EmptyState } from "@/components/admin/admin-ui";
import type { UserDoc } from "@/lib/types";

export default function AdminUsuariosPage() {
  const firestore = useFirestore();

  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: users, loading } = useCollection<UserDoc>(usersQuery);

  return (
    <div>
      <PageHeader title="Usuarios" description="Cuentas registradas en la plataforma." />

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando…</p>}
      {!loading && (users?.length ?? 0) === 0 && (
        <EmptyState title="Sin usuarios" description="Los usuarios registrados aparecerán aquí." />
      )}

      <div className="space-y-2">
        {users?.map((u) => (
          <Link key={u.id} href={`/admin/usuarios/${u.id}`} className="no-underline">
            <AdminCard className="flex items-center justify-between transition-colors hover:bg-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[12px] font-bold text-white">
                  {(u.displayName || u.email || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{u.displayName || "Sin nombre"}</p>
                  <p className="text-[11px] text-white/40">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {u.role === "admin" && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary">Admin</span>}
                {u.blocked && <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-danger">Bloqueado</span>}
                <ChevronRight className="h-4 w-4 text-white/25" />
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
