"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Layers, ShieldCheck, Crown, BadgeCheck, Share2, MessageCircle } from "lucide-react";
import { useFirestore, useDoc, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { UserAvatar } from "@/components/user-avatar";
import { computeScore, levelFor } from "@/lib/levels";
import { cn } from "@/lib/utils";
import type { PublicProfile, GroupDoc, Review } from "@/lib/types";

export default function PublicProfilePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const firestore = useFirestore();

  const profileRef = useMemo(() => (firestore ? doc(firestore, "publicProfiles", id) : null), [firestore, id]);
  const { data: profile, loading } = useDoc<PublicProfile>(profileRef);

  const groupsRef = useMemo(() => (firestore ? query(collection(firestore, "groups"), where("hostId", "==", id)) : null), [firestore, id]);
  const { data: groups } = useCollection<GroupDoc>(groupsRef);

  const reviewsRef = useMemo(() => (firestore ? query(collection(firestore, "reviews"), where("hostId", "==", id)) : null), [firestore, id]);
  const { data: reviews } = useCollection<Review>(reviewsRef);

  const { toast } = useToast();
  const activeGroups = (groups ?? []).filter((g) => g.approval === "approved");
  const ratingCount = profile?.ratingCount ?? 0;
  const ratingAvg = ratingCount > 0 ? (profile?.ratingSum ?? 0) / ratingCount : 0;

  const createdAtMs = profile?.createdAt && typeof profile.createdAt === "object" && "seconds" in profile.createdAt
    ? (profile.createdAt as { seconds: number }).seconds * 1000 : undefined;
  const lvl = levelFor(computeScore({
    createdAtMs,
    groupsActive: activeGroups.length,
    membersServed: activeGroups.reduce((a, g) => a + g.slotsFilled, 0),
    ratingSum: profile?.ratingSum ?? 0,
  }));
  const verified = !!profile?.verifiedEmail && !!profile?.verifiedProfile;

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: profile?.displayName, url });
      else { await navigator.clipboard.writeText(url); toast({ title: "Enlace copiado" }); }
    } catch { /* cancelado */ }
  };

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
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <h1 className="text-xl font-extrabold tracking-tight text-on-surface">{profile.displayName}</h1>
          {verified && <BadgeCheck className="h-5 w-5 text-success" />}
        </div>
        <div className="mt-1 flex items-center justify-center gap-1.5">
          <Crown className="h-3.5 w-3.5" style={{ color: lvl.current.color }} />
          <span className="text-[11px] font-bold" style={{ color: lvl.current.color }}>Nivel {lvl.current.label}</span>
        </div>
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

      {/* Contacto + compartir */}
      <div className="flex gap-2">
        {profile.whatsapp && (
          <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener" className="no-underline flex-1">
            <Button className="h-11 w-full rounded-2xl bg-success font-bold text-white hover:bg-success/90"><MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp</Button>
          </a>
        )}
        <Button variant="outline" className="h-11 flex-1 rounded-2xl font-bold" onClick={share}><Share2 className="mr-1.5 h-4 w-4" /> Compartir</Button>
      </div>

      {/* Reseñas */}
      <section className="space-y-2">
        <h2 className="px-1 text-[11px] font-black uppercase tracking-widest text-on-surface/40">Reseñas</h2>
        {(reviews ?? []).length === 0 && (
          <p className="px-2 text-[11px] text-on-surface/30">Aún no hay reseñas.</p>
        )}
        {(reviews ?? []).map((r) => (
          <div key={r.id} className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-bold text-on-surface">{r.raterName || "Miembro"}</p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={cn("h-3.5 w-3.5", n <= r.stars ? "fill-warning text-warning" : "text-on-surface/15")} />
                ))}
              </div>
            </div>
            {r.comment && <p className="mt-1 text-[12px] leading-snug text-on-surface/60">{r.comment}</p>}
          </div>
        ))}
      </section>
    </div>
  );
}
