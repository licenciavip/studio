"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, LayoutGrid, Clock, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { GroupDoc } from "@/lib/types";

export default function MisGruposPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState<"Active" | "Pending">("Active");

  const hostedQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "groups"), where("hostId", "==", user.uid)) : null),
    [firestore, user]
  );
  const { data: hosted, loading: l1 } = useCollection<GroupDoc>(hostedQuery);

  const memberQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "groups"), where("memberIds", "array-contains", user.uid)) : null),
    [firestore, user]
  );
  const { data: member, loading: l2 } = useCollection<GroupDoc>(memberQuery);

  const loading = l1 || l2;

  // Combina hosted + member, marcando el rol. (No se solapan: no te unes a tu propio grupo.)
  const all = useMemo(() => {
    const list: Array<GroupDoc & { role: "Anfitrión" | "Miembro" }> = [];
    for (const g of hosted ?? []) list.push({ ...g, role: "Anfitrión" });
    for (const g of member ?? []) list.push({ ...g, role: "Miembro" });
    return list;
  }, [hosted, member]);

  const displayGroups = all.filter((g) =>
    activeTab === "Active"
      ? g.role === "Miembro" || g.approval === "approved"
      : g.role === "Anfitrión" && g.approval !== "approved"
  );

  return (
    <div className="pb-32 pt-2 space-y-6">
      <div className="px-1 space-y-0.5">
        <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Mis Grupos</h2>
        <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Suscripciones que publicaste o a las que te uniste</p>
      </div>

      <div className="p-1 bg-white/30 backdrop-blur-3xl border border-white/40 rounded-2xl flex shadow-sm">
        <button onClick={() => setActiveTab("Active")} className={cn("flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2", activeTab === "Active" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant/40")}>
          <LayoutGrid className="h-3 w-3" /> Activos
        </button>
        <button onClick={() => setActiveTab("Pending")} className={cn("flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2", activeTab === "Pending" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant/40")}>
          <Clock className="h-3 w-3" /> Pendientes
        </button>
      </div>

      {loading && <p className="py-10 text-center text-[10px] font-black uppercase tracking-widest text-on-surface/30">Cargando…</p>}

      <div className="space-y-2">
        {!loading && displayGroups.length > 0 ? (
          <div className="glass-card rounded-[2rem] overflow-hidden divide-y divide-white/10">
            {displayGroups.map((group) => (
              <Link href={`/mis-grupos/${group.id}`} key={group.id} className="flex items-center justify-between p-4 hover:bg-white/40 transition-all group active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: group.serviceColor || "#4343d5" }}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-on-surface tracking-tight">{group.serviceName}</h3>
                    <div className="flex items-center gap-2">
                      {group.role === "Miembro" ? (
                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary">Miembro</span>
                      ) : group.approval === "pending" ? (
                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-warning/10 text-warning">En revisión</span>
                      ) : group.approval === "rejected" ? (
                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-danger/10 text-danger">Rechazado</span>
                      ) : (
                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">Anfitrión</span>
                      )}
                      <div className="flex items-center gap-1 text-[8px] font-bold text-on-surface-variant/40 uppercase">
                        <Users className="h-2.5 w-2.5" />
                        {group.slotsFilled}/{group.slotsTotal}
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-on-surface-variant/20 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-16 glass-card rounded-[2.5rem] border-dashed border-primary/10">
            <p className="text-on-surface-variant/40 text-[10px] font-black uppercase tracking-widest">Sin grupos {activeTab === "Active" ? "activos" : "pendientes"}</p>
            <Button asChild variant="link" className="mt-2 text-primary text-[11px] font-bold uppercase tracking-tight">
              <Link href="/explorar">Explorar cupos</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
