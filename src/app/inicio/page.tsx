"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { servicesByCategory } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight, Plus, Sparkles, Zap,
  TrendingDown, TrendingUp, Search
} from "lucide-react";
import type { CategorySlug, Service, GroupDoc } from "@/lib/types";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

const categoryLabels: Record<string, string> = {
  ia: "IA & Herramientas",
};

const NOVEDADES = [
  {
    id: 1,
    title: "IA Pro Ilimitada",
    desc: "Claude 3.5 Sonnet disponible",
    icon: Sparkles,
    accent: "#5E5CE6",
  },
  {
    id: 2,
    title: "Pagos Rápidos",
    desc: "Validación BCP < 30 min",
    icon: Zap,
    accent: "#FF9F0A",
  },
];

export default function InicioPage() {
  const [recommendation, setRecommendation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const groupsQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "groups"), where("hostId", "==", user.uid)) : null),
    [firestore, user]
  );
  const { data: groups } = useCollection<GroupDoc>(groupsQuery);

  const groupedServices = useMemo(() =>
    Object.fromEntries(
      Object.entries(servicesByCategory).filter(([_, s]) => s.length > 0)
    ) as Record<CategorySlug, Service[]>,
  []);

  const handleRecommend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && recommendation.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        toast({ title: "¡Gracias!", description: "Sugerencia recibida." });
        setRecommendation("");
        setIsSubmitting(false);
      }, 600);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* ── Hero card — propuesta de valor ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5E5CE6] to-primary p-5 sm:p-6 shadow-[0_8px_32px_rgba(10,132,255,0.28),inset_0_1px_0_rgba(255,255,255,0.20)]">
        {/* Glare */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,transparent_70%)]" />

        <p className="mb-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-white/55">
          Poolera Digital
        </p>
        <h1 className="mb-1.5 text-xl sm:text-2xl font-extrabold leading-tight tracking-tighter text-white">
          Accede a IA premium<br />pagando solo tu parte
        </h1>
        <p className="mb-4 text-xs sm:text-sm font-medium leading-relaxed text-white/70">
          Comparte o compra cupos de ChatGPT, Claude, Gemini y más. Hasta <strong className="text-white">70% más barato</strong>.
        </p>

        <div className="flex gap-2">
          <Link href="/explorar" className="flex-1 no-underline">
            <div className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-white/95 text-xs sm:text-sm font-bold text-primary shadow-md transition-transform active:scale-95">
              <TrendingDown className="h-3.5 w-3.5" /> Explorar cupos
            </div>
          </Link>
          <Link href="/compartir" className="flex-1 no-underline">
            <div className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-white/35 bg-white/[0.18] text-xs sm:text-sm font-bold text-white/90 transition-transform active:scale-95">
              <TrendingUp className="h-3.5 w-3.5" /> Compartir
            </div>
          </Link>
        </div>
      </section>

      {/* ── Saludo + acción principal ── */}
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-on-surface">
          Hola{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""} 👋
        </h2>
        <Link href="/compartir" className="no-underline">
          <div className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary shadow-[0_4px_18px_rgba(10,132,255,0.35),inset_0_1px_0_rgba(255,255,255,0.20)] transition-transform active:scale-[0.98]">
            <Plus className="h-4 w-4 text-white" strokeWidth={2.5} />
            <span className="text-sm font-bold tracking-tight text-white">
              Compartir suscripción
            </span>
          </div>
        </Link>
      </section>

      {/* ── Grupos activos ── */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-on-surface/40">
            Activos
          </span>
          <Link href="/mis-grupos" className="text-[11px] font-bold text-primary no-underline">
            Ver todo
          </Link>
        </div>

        {(groups ?? []).length === 0 && (
          <div className="glass-card rounded-2xl px-3.5 py-5 text-center">
            <p className="text-[11px] font-medium text-on-surface/40">Aún no tienes grupos</p>
          </div>
        )}
        {(groups ?? []).slice(0, 1).map((group) => (
          <Link key={group.id} href={`/mis-grupos/${group.id}`} className="no-underline">
            <div className="glass-card flex items-center justify-between rounded-2xl px-3.5 py-3 transition-transform active:scale-[0.98]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-on-surface">
                    {group.serviceName}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-on-surface/40">
                    {group.slotsFilled}/{group.slotsTotal} cupos
                  </p>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-on-surface/25" />
            </div>
          </Link>
        ))}
      </section>

      {/* ── Novedades ── */}
      <section className="flex flex-col gap-2">
        <span className="px-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-on-surface/40">
          Novedades
        </span>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5 sm:grid sm:grid-cols-2 sm:overflow-visible">
          {NOVEDADES.map(({ id, title, desc, icon: Icon, accent }) => (
            <div key={id} className="glass-card flex min-w-[160px] flex-col gap-2 rounded-2xl p-3.5 sm:min-w-0">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: `${accent}14` }}
              >
                <Icon className="h-4 w-4" style={{ color: accent }} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold tracking-tight text-on-surface">{title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-on-surface/45">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Grid de servicios ── */}
      {Object.entries(groupedServices).map(([slug, services]) => (
        <section key={slug} className="flex flex-col gap-2">
          <span className="px-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-on-surface/40">
            {categoryLabels[slug] || slug}
          </span>
          <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 sm:grid-cols-4 sm:gap-3">
            {services.map((service) => {
              const isLight = service.color?.toLowerCase() === "#ffffff";
              const bg = isLight ? undefined : (service.color || "#4343d5");
              return (
                <Link key={service.id} href="/explorar" className="no-underline">
                  <div
                    className={`relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl p-3 transition-transform active:scale-95 ${
                      isLight ? "glass-card" : "shadow-lg shadow-black/10"
                    }`}
                    style={bg ? { background: bg } : undefined}
                  >
                    {!isLight && (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent" />
                    )}
                    <div className="relative z-10">
                      <p className={`text-xs sm:text-sm font-extrabold leading-tight tracking-tight ${isLight ? "text-on-surface" : "text-white/95"}`}>
                        {service.name}
                      </p>
                      <p className={`mt-0.5 text-[9px] font-semibold uppercase tracking-[0.03em] ${isLight ? "text-on-surface/40" : "text-white/55"}`}>
                        {service.planName || "PRO"}
                      </p>
                    </div>
                    <div className="relative z-10">
                      <p className={`text-[9px] font-bold uppercase tracking-[0.03em] ${isLight ? "text-on-surface/40" : "text-white/55"}`}>
                        Desde
                      </p>
                      <p className={`text-sm sm:text-base font-extrabold tracking-tight ${isLight ? "text-on-surface" : "text-white/95"}`}>
                        S/{service.pricePerMonth}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* ── Sugerencias ── */}
      <section className="glass-card mb-2 rounded-3xl p-5 text-center">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-on-surface/35">
          Propón una IA
        </p>
        <p className="mb-3 text-xs sm:text-sm text-on-surface/50">
          ¿No encuentras lo que buscas?
        </p>
        <div className="relative mx-auto max-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-on-surface/30" />
          <input
            className="glass-input h-9 w-full pl-8 text-left text-xs sm:text-sm"
            placeholder="Ej: Midjourney..."
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            onKeyDown={handleRecommend}
            disabled={isSubmitting}
          />
        </div>
      </section>
    </div>
  );
}
