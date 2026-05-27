"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { servicesByCategory, groups } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, PlusCircle, Sparkles, Zap, ShieldCheck } from "lucide-react";
import type { CategorySlug, Service } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  ia: "IA & Herramientas",
};

const NOVEDADES = [
  {
    id: 1,
    title: "IA Pro Ilimitada",
    desc: "Nuevos grupos de Claude 3.5 Sonnet disponibles.",
    icon: <Sparkles className="h-4 w-4" />,
    color: "from-primary/20 to-primary/5",
  },
  {
    id: 2,
    title: "Pagos Instantáneos",
    desc: "Validación BCP ahora en menos de 30 minutos.",
    icon: <Zap className="h-4 w-4" />,
    color: "from-secondary/20 to-secondary/5",
  },
  {
    id: 3,
    title: "Seguridad Premium",
    desc: "Protección de cuenta avanzada activa en todos los grupos.",
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "from-tertiary/20 to-tertiary/5",
  },
];

export default function Home() {
  const [recommendation, setRecommendation] = useState("");
  const [isSubmittingRecLocal, setIsSubmittingRecLocal] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const user = auth?.currentUser;

  const groupedServices = useMemo(() => {
    return Object.fromEntries(
      Object.entries(servicesByCategory).filter(([_, services]) => services.length > 0)
    ) as Record<CategorySlug, Service[]>;
  }, []);

  const handleRecommendSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && recommendation.trim()) {
      if (!auth.currentUser) {
        toast({
          title: "Inicia sesión",
          description: "Debes estar conectado para enviar una sugerencia.",
          variant: "destructive"
        });
        return;
      }

      setIsSubmittingRecLocal(true);
      try {
        await addDoc(collection(firestore, "serviceRecommendations"), {
          userId: auth.currentUser.uid,
          serviceName: recommendation.trim(),
          createdAt: serverTimestamp(),
        });

        toast({
          title: "¡Gracias!",
          description: "Hemos recibido tu sugerencia.",
        });
        setRecommendation("");
      } catch (error) {
        toast({
          title: "Error",
          description: "No pudimos guardar tu sugerencia.",
          variant: "destructive"
        });
      } finally {
        setIsSubmittingRecLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-10">
      <main className="flex-grow w-full max-w-xl mx-auto pb-24 px-4 space-y-5">
        
        {/* SALUDO COMPACTO */}
        <section className="space-y-3">
          <div className="px-1">
            <h1 className="text-[9px] font-black text-on-surface/20 uppercase tracking-[0.3em] mb-0.5">
              Bienvenido
            </h1>
            <h2 className="text-xl font-extrabold text-on-surface tracking-tightest">
              Hola, {user?.displayName?.split(' ')[0] || 'Deyvid'} 👋
            </h2>
          </div>
          
          <Link href="/compartir" className="block group">
            <div className="relative overflow-hidden w-full h-11 bg-primary rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all">
              <PlusCircle className="h-4 w-4 text-white" />
              <span className="text-white font-bold text-[11px] tracking-tight">Compartir suscripción</span>
            </div>
          </Link>
        </section>

        {/* MIS GRUPOS COMPACTOS */}
        <section className="space-y-2">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-[9px] font-black text-on-surface/20 tracking-widest uppercase">Mis Grupos</h2>
            <Link href="/mis-grupos" className="text-[8px] font-black text-primary/40 uppercase tracking-[0.2em]">VER TODO</Link>
          </div>
          {groups.slice(0, 1).map((group) => (
            <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block group">
              <div className="glass-card rounded-[1.8rem] p-3 flex items-center justify-between transition-all active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/40 flex items-center justify-center border border-white/60 shadow-sm">
                    <Image src={`https://picsum.photos/seed/${group.id}/100/100`} alt={group.service} width={20} height={20} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="text-[12px] font-bold text-on-surface tracking-tight leading-none">{group.service}</h3>
                    <p className="text-[8px] text-on-surface-variant/30 font-bold uppercase tracking-tighter mt-1">{group.slots.filled}/{group.slots.total} vendidos</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-on-surface-variant/20 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </section>

        {/* NOVEDADES - CAROUSEL HORIZONTAL VISIONOS */}
        <section className="space-y-2">
          <div className="px-2">
            <h2 className="text-[9px] font-black text-on-surface/20 tracking-widest uppercase">Novedades</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-1 -mx-1 pb-2">
            {NOVEDADES.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "min-w-[220px] glass-card p-4 rounded-[1.8rem] bg-gradient-to-br border-white/40 flex flex-col justify-between h-[100px]",
                  item.color
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-white/40 text-on-surface/60">
                    {item.icon}
                  </div>
                  <span className="text-[7px] font-black text-on-surface/20 uppercase tracking-widest">Poolera News</span>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-on-surface leading-tight">{item.title}</h4>
                  <p className="text-[8px] text-on-surface-variant/50 font-medium leading-tight mt-0.5 line-clamp-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* IA & HERRAMIENTAS - GRID ALTA DENSIDAD */}
        <section className="space-y-3">
          {Object.entries(groupedServices).map(([slug, services]) => (
            <div key={slug} className="space-y-2">
              <div className="px-2">
                <h2 className="text-[9px] font-black text-on-surface/20 tracking-widest uppercase">
                  {categoryLabels[slug] || slug}
                </h2>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {services.map((service) => {
                  const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
                  const brandColor = isWhiteBg ? "text-primary" : "text-white";
                  
                  return (
                    <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                      <div 
                        className={cn(
                          "relative rounded-[2rem] p-3 aspect-[4/5] flex flex-col justify-between transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] overflow-hidden border border-white/5",
                          isWhiteBg ? "glass-card" : "shadow-lg shadow-black/5"
                        )}
                        style={{ backgroundColor: !isWhiteBg ? (service.color || '#4343d5') : undefined }}
                      >
                        {!isWhiteBg && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}
                        
                        <div className="relative z-10 space-y-0.5">
                          <h3 className={cn("text-[10px] font-extrabold tracking-tight leading-none truncate", brandColor)}>
                            {service.name}
                          </h3>
                          <p className={cn("text-[7px] font-black opacity-50 uppercase tracking-widest", brandColor)}>
                            {service.planName || "PRO"}
                          </p>
                        </div>

                        <div className="relative z-10">
                          <p className={cn("text-[6px] font-black uppercase tracking-[0.2em] opacity-30", brandColor)}>
                            DESDE
                          </p>
                          <span className={cn("text-xs font-black tracking-tighter", brandColor)}>
                            S/ {service.pricePerMonth}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* SUGERENCIAS COMPACTAS */}
        <section className="glass-card rounded-[2.5rem] p-6 text-center space-y-3 mb-8">
          <div className="space-y-1">
            <h2 className="text-[8px] font-black text-on-surface/10 uppercase tracking-[0.4em]">Propón una IA</h2>
            <p className="text-[10px] text-on-surface-variant/40 font-bold tracking-tight">¿No encuentras lo que buscas?</p>
          </div>
          <div className="max-w-[200px] mx-auto space-y-2">
            <input 
              className="glass-input w-full text-[11px] font-bold text-center h-10 placeholder:text-[9px] placeholder:opacity-20" 
              placeholder="EJ: MIDJOURNEY..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRecLocal}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
