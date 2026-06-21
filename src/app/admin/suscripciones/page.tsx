"use client";

import { useMemo } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { PageHeader, AdminCard, EmptyState } from "@/components/admin/admin-ui";
import type { GroupDoc } from "@/lib/types";

const statusCls: Record<GroupDoc["status"], string> = {
  Activo: "bg-success/15 text-success",
  Incompleto: "bg-warning/15 text-warning",
  Finalizado: "bg-on-surface/10 text-white/40",
};

export default function AdminSuscripcionesPage() {
  const firestore = useFirestore();

  const groupsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "groups"), orderBy("updatedAt", "desc"));
  }, [firestore]);

  const { data: groups, loading } = useCollection<GroupDoc>(groupsQuery);

  return (
    <div>
      <PageHeader title="Suscripciones" description="Grupos publicados en la plataforma." />

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando…</p>}
      {!loading && (groups?.length ?? 0) === 0 && (
        <EmptyState title="Sin grupos" description="Cuando los usuarios publiquen suscripciones aparecerán aquí." />
      )}

      <div className="space-y-2">
        {groups?.map((g) => (
          <AdminCard key={g.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl shrink-0" style={{ background: g.serviceColor || "#4343d5" }} />
              <div>
                <p className="text-sm font-bold text-white">{g.serviceName}</p>
                <p className="text-[11px] text-white/40">por {g.hostName} · {g.slotsFilled}/{g.slotsTotal} cupos</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">S/{g.pricePerSlot.toFixed(2)}</p>
              <span className={cn("inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest", statusCls[g.status])}>{g.status}</span>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
