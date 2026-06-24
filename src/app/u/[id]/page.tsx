"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Layers, ShieldCheck } from "lucide-react";
import { useFirestore, useDoc, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { UserAvatar } from "@/components/user-avatar";
import type { PublicProfile, GroupDoc } from "@/lib/types";

export default function PublicProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const firestore = useFirestore();

  const profileRef = useMemo(() => (firestore ? doc(firestore, "publicProfiles", id) : null), [firestore, id]);
  const { data: profile, loading } = useDoc<PublicProfile>(profileRef);

  const groupsRef = useMemo(() => (firestore ? query(collection(firestore, "groups"), where("hostId", "==", id)) : null), [firestore, id]);
  const { data: groups } = useCollection<GroupDoc>(groupsRef);

  const activeGroups = (groups ?? []).filter((g) => g.approval === "approved");
  const ratingCount = profile?.ratingCount ?? 0;
  const ratingAvg = ratingCount > 0 ? (profile?.ratingSum ?? 0) / ratingCount : 0;

  const since = useMemo(() => {
    const ts = profile?.createdAt;
    if (ts && typeof ts === "object" && "seconds" in ts) {
      return new Date((ts as { seconds: number }).seconds * 1000).toLocaleDateString("es-PE", { month: "long", year: "numeric" });
    }
    return null;
  }, [profile]);

  if (loading) {
    return <p className="pt-10 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface/30">Cargando…</p>;
  }
  if (!profile) {
    return (
      <div className="pt-10 text-center space-y-3">
        <p className="text-sm text-on-surface/40">Perfil no encontrado</p>
        <Button asChild variant="link"><Link href="/explorar">Explorar</Link></Button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2 space-y-5">
      <button onClick={() => history.back()} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-on-surface/40">
        <ArrowLeft className="h-3.5 w-3.5" /> Volver
      </button>

      {/* Cabecera */}
      <div className="glass-card rounded-[2rem] p-6 text-center">
        <div className="mx-auto w-fit">
          <UserAvatar name={profile.displayName} seed={profile.avatarSeed} size={80} className="border border-white/30 shadow-lg" />
        </div>
        <h1 className="mt-3 text-xl font-extrabold tracking-tight text-on-surface">{profile.displayName}</h1>
        {since && <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-on-surface/40">Anfitrión desde {since}</p>}

        {/* Reputación */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          <Star className={ratingCount > 0 ? "h-5 w-5 fill-warning text-warning" : "h-5 w-5 text-on-surface/20"} />
          <span className="text-lg font-extrabold text-on-surface">{ratingCount > 0 ? ratingAvg.toFixed(1) : "—"}</span>
          <span className="text-[11px] text-on-surface/40">({ratingCount} {ratingCount === 1 ? "reseña" : "reseñas"})</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <Layers className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-1 text-2xl font-extrabold text-on-surface">{activeGroups.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Grupos activos</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <ShieldCheck className="mx-auto h-5 w-5 text-success" />
          <p className="mt-1 text-2xl font-extrabold text-on-surface">{activeGroups.reduce((a, g) => a + g.slotsFilled, 0)}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Miembros atendidos</p>
        </div>
      </div>

      <p className="px-2 text-center text-[10px] text-on-surface/30">Las reseñas de los miembros aparecerán aquí.</p>
    </div>
  );
}
