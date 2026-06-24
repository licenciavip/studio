"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Sparkles, Users, ChevronRight, Star } from "lucide-react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { LevelBadge } from "@/components/level-badge";
import type { GroupDoc, PublicProfile } from "@/lib/types";

export default function ExplorarPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const groupsQuery = useMemo(
    () => (firestore ? query(collection(firestore, "groups"), where("approval", "==", "approved")) : null),
    [firestore]
  );
  const { data: groups, loading } = useCollection<GroupDoc>(groupsQuery);

  // Reputación de los anfitriones (lectura pública, un solo query).
  const profilesQuery = useMemo(() => (firestore ? query(collection(firestore, "publicProfiles")) : null), [firestore]);
  const { data: profiles } = useCollection<PublicProfile>(profilesQuery);
  const ratingByHost = useMemo(() => {
    const m = new Map<string, { avg: number; count: number }>();
    for (const p of profiles ?? []) {
      const count = p.ratingCount ?? 0;
      if (count > 0) m.set(p.uid, { avg: (p.ratingSum ?? 0) / count, count });
    }
    return m;
  }, [profiles]);

  const tierByHost = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of profiles ?? []) if (p.tierKey) m.set(p.uid, p.tierKey);
    return m;
  }, [profiles]);

  // Grupos con cupos libres, que no sean míos ni a los que ya pertenezco.
  const available = useMemo(() => {
    return (groups ?? []).filter(
      (g) =>
        g.slotsFilled < g.slotsTotal &&
        g.hostId !== user?.uid &&
        !(g.memberIds ?? []).includes(user?.uid ?? "")
    );
  }, [groups, user]);

  return (
    <div className="pb-24 pt-2 space-y-5">
      <div className="px-1">
        <h1 className="text-xl font-extrabold tracking-tight text-on-surface">Explorar cupos</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">Únete a un grupo y paga solo tu parte</p>
      </div>

      {loading && <p className="py-10 text-center text-[10px] font-black uppercase tracking-widest text-on-surface/30">Cargando…</p>}

      {!loading && available.length === 0 && (
        <div className="glass-card rounded-[2rem] py-16 text-center border-dashed">
          <p className="text-[11px] font-bold text-on-surface/40">No hay cupos disponibles ahora</p>
          <p className="mt-1 text-[10px] text-on-surface/30">Vuelve pronto o publica el tuyo</p>
        </div>
      )}

      <div className="space-y-2">
        {available.map((g) => {
          const free = g.slotsTotal - g.slotsFilled;
          return (
            <Link key={g.id} href={`/checkout/${g.id}`} className="no-underline">
              <div className="glass-card flex items-center justify-between rounded-2xl p-4 transition-all hover:bg-white/50 active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white shrink-0" style={{ background: g.serviceColor || "#4343d5" }}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold tracking-tight text-on-surface">{g.serviceName}</p>
                      {tierByHost.get(g.hostId) && <LevelBadge tierKey={tierByHost.get(g.hostId)} size="xs" />}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant/40">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {free} {free === 1 ? "libre" : "libres"}</span>
                      {ratingByHost.get(g.hostId) && (
                        <span className="flex items-center gap-0.5 text-warning"><Star className="h-3 w-3 fill-warning" /> {ratingByHost.get(g.hostId)!.avg.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest text-on-surface/30">Desde</p>
                    <p className="text-sm font-extrabold tracking-tight text-primary">S/{g.pricePerSlot.toFixed(2)}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-on-surface/25" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
