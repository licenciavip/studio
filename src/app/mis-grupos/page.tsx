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

  const groupsQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "groups"), where("hostId", "==", user.uid)) : null),
    [firestore, user]
  );
  const { data: groups, loading } = useCollection<GroupDoc>(groupsQuery);

  const displayGroups = (groups ?? []).filter((g) =>
    activeTab === "Active" ? g.approval === "approved" : g.approval !== "approved"
  );

  return (
    <div className="pb-32 pt-2 space-y-6">
      <div className="px-1 space-y-0.5">
        <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Mis Grupos</h2>
        <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Suscripciones que publicaste</p>
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
                      {group.approval === "pending" && (
                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-warning/10 text-warning">En revisión</span>
                      )}
                      {group.approval === "rejected" && (
                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-danger/10 text-danger">Rechazado</span>
                      )}
                      {group.approval === "approved" && (
                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">Anfitrión</span>
                      )}
                      <div className="flex items-center gap-1 text-[8px] font-bold text-on-surface-variant/40 uppercase">
                        <Users className="h-2.5 w-2.5" />
                        {group.slotsFilled}/{group.slotsTotal}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-on-surface-variant/30 uppercase tracking-widest">Ganancia</p>
                    <p className="text-[11px] font-bold text-on-surface">S/{group.hostEarning.toFixed(2)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-on-surface-variant/20 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-16 glass-card rounded-[2.5rem] border-dashed border-primary/10">
            <p className="text-on-surface-variant/40 text-[10px] font-black uppercase tracking-widest">Sin grupos {activeTab === "Active" ? "activos" : "pendientes"}</p>
            <Button asChild variant="link" className="mt-2 text-primary text-[11px] font-bold uppercase tracking-tight">
              <Link href="/compartir">Publicar suscripción</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
