"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { servicesByCategory, groups } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, PlusCircle, Sparkles, Zap, Users, TrendingDown, LogIn } from "lucide-react";
import type { CategorySlug, Service } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  ia: "IA & Herramientas",
};

const NOVEDADES = [
  {
    id: 1,
    title: "IA Pro Ilimitada",
    desc: "Claude 3.5 Sonnet disponible.",
    icon: <Sparkles className="h-3 w-3" />,
    color: "from-primary/10 to-primary/5",
  },
  {
    id: 2,
    title: "Pagos Instantáneos",
    desc: "Validación BCP < 30 min.",
    icon: <Zap className="h-3 w-3" />,
    color: "from-secondary/10 to-secondary/5",
  },
];

// Mock: simulate no logged-in user for demo
const MOCK_USER = { displayName: "Deyvid" };

export default function Home() {
  const [recommendation, setRecommendation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Mock user — replace with real auth when Firebase is connected
  const user = MOCK_USER;

  const groupedServices = useMemo(() => {
    return Object.fromEntries(
      Object.entries(servicesByCategory).filter(([_, services]) => services.length > 0)
    ) as Record<CategorySlug, Service[]>;
  }, []);

  const handleRecommendSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-xl mx-auto pb-24 px-4 space-y-4">

        {/* HERO — explicación clara para nuevos usuarios */}
        <section className="glass-card rounded-[2rem] p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-[7px] font-black text-on-surface/20 uppercase tracking-[0.4em]">Poolera Digital</p>
            <h1 className="text-base font-extrabold text-on-surface tracking-tight leading-snug">
              Accede a IA premium<br />pagando solo tu parte
            </h1>
            <p className="text-[10px] text-on-surface/40 font-medium leading-relaxed">
              Comparte o compra cupos de ChatGPT, Claude, Gemini y más. Hasta <span className="font-bold text-primary">70% más barato</span>.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-1.5 p-2 bg-primary/5 rounded-xl border border-primary/10">
              <TrendingDown className="h-3 w-3 text-primary shrink-0" />
              <div>
                <p className="text-[8px] font-black text-primary">Miembro</p>
                <p className="text-[7px] text-on-surface/40">Úsala pagando menos</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-1.5 p-2 bg-green-500/5 rounded-xl border border-green-500/10">
              <TrendingDown className="h-3 w-3 text-green-500 shrink-0 rotate-180" />
              <div>
                <p className="text-[8px] font-black text-green-600">Anfitrión</p>
                <p className="text-[7px] text-on-surface/40">Vende tus cupos libres</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/explorar" className="flex-1">
              <div className="w-full h-9 bg-primary/10 rounded-xl flex items-center justify-center gap-1.5 text-primary font-bold text-[10px] hover:bg-primary/20 transition-all active:scale-95">
                <Users className="h-3 w-3" /> Explorar cupos
              </div>
            </Link>
            <Link href="/login" className="flex-1">
              <div className="w-full h-9 bg-white/30 rounded-xl flex items-center justify-center gap-1.5 text-on-surface/60 font-bold text-[10px] hover:bg-white/50 transition-all active:scale-95 border border-white/40">
                <LogIn className="h-3 w-3" /> Entrar / Registrarse
              </div>
            </Link>
          </div>
        </section>

        {/* SALUDO + COMPARTIR */}
        <section className="space-y-3">
          <div className="px-1">
            <h2 className="text-base font-extrabold text-on-surface tracking-tightest">
              Hola, {user?.displayName?.split(" ")[0] || "Deyvid"} 👋
            </h2>
          </div>
          <Link href="/compartir" className="block group">
            <div className="relative overflow-hidden w-full h-10 bg-primary rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/10 hover:scale-[1.01] active:scale-[0.98] transition-all">
              <PlusCircle className="h-3.5 w-3.5 text-white" />
              <span className="text-white font-bold text-[10px] tracking-tight">Compartir suscripción</span>
            </div>
          </Link>
        </section>

        {/* MIS GRUPOS */}
        <section className="space-y-1.5">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-[7px] font-black text-on-surface/20 tracking-widest uppercase">Activos</h2>
            <Link href="/mis-grupos" className="text-[7px] font-black text-primary/40 uppercase tracking-[0.2em]">VER TODO</Link>
          </div>
          {groups.slice(0, 1).map((group) => (
            <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block group">
              <div className="glass-card rounded-2xl p-2.5 flex items-center justify-between transition-all active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-on-surface tracking-tight leading-none">{group.service}</h3>
                    <p className="text-[7px] text-on-surface-variant/30 font-bold uppercase tracking-tighter mt-0.5">{group.slots.filled}/{group.slots.total} cupos</p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-on-surface-variant/20 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </section>

        {/* NOVEDADES */}
        <section className="space-y-1.5">
          <div className="px-2">
            <h2 className="text-[7px] font-black text-on-surface/20 tracking-widest uppercase">Novedades</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 -mx-1 pb-1">
            {NOVEDADES.map((item) => (
              <div key={item.id} className={cn("min-w-[140px] glass-card p-3 rounded-2xl bg-gradient-to-br border-white/40 flex flex-col justify-between h-[64px]", item.color)}>
                <div className="flex items-center justify-between">
                  <div className="p-1 rounded-lg bg-white/40 text-on-surface/60">{item.icon}</div>
                  <span className="text-[5px] font-black text-on-surface/20 uppercase tracking-widest">News</span>
                </div>
                <div>
                  <h4 className="text-[9px] font-bold text-on-surface leading-tight">{item.title}</h4>
                  <p className="text-[7px] text-on-surface-variant/40 font-medium leading-tight mt-0.5 line-clamp-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICIOS GRID */}
        <section className="space-y-2">
          {Object.entries(groupedServices).map(([slug, services]) => (
            <div key={slug} className="space-y-1.5">
              <div className="px-2">
                <h2 className="text-[7px] font-black text-on-surface/20 tracking-widest uppercase">{categoryLabels[slug] || slug}</h2>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {services.map((service) => {
                  const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
                  const brandColor = isWhiteBg ? "text-primary" : "text-white";
                  return (
                    <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                      <div
                        className={cn("relative rounded-2xl p-2 aspect-square flex flex-col justify-between transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] overflow-hidden border border-white/5", isWhiteBg ? "glass-card" : "shadow-lg shadow-black/5")}
                        style={{ backgroundColor: !isWhiteBg ? (service.color || "#4343d5") : undefined }}
                      >
                        {!isWhiteBg && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}
                        <div className="relative z-10 space-y-0.5">
                          <h3 className={cn("text-[8px] font-extrabold tracking-tight leading-none truncate", brandColor)}>{service.name}</h3>
                          <p className={cn("text-[5px] font-black opacity-40 uppercase tracking-widest", brandColor)}>{service.planName || "PRO"}</p>
                        </div>
                        <div className="relative z-10">
                          <p className={cn("text-[5px] font-black uppercase tracking-tighter opacity-30", brandColor)}>DESDE</p>
                          <span className={cn("text-[10px] font-black tracking-tighter", brandColor)}>S/ {service.pricePerMonth}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* SUGERENCIAS */}
        <section className="glass-card rounded-[2rem] p-4 text-center space-y-2 mb-8">
          <div className="space-y-0.5">
            <h2 className="text-[6px] font-black text-on-surface/10 uppercase tracking-[0.5em]">Propón una IA</h2>
            <p className="text-[8px] text-on-surface-variant/40 font-bold tracking-tight">¿No encuentras lo que buscas?</p>
          </div>
          <div className="max-w-[120px] mx-auto">
            <input
              className="glass-input w-full text-[9px] font-bold text-center h-8 placeholder:text-[7px] placeholder:opacity-20"
              placeholder="EJ: MIDJOURNEY..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmitting}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
