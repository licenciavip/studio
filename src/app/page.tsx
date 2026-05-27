"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { servicesByCategory, groups } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, PlusCircle, Sparkles } from "lucide-react";
import type { CategorySlug, Service } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  ia: "IA & Herramientas",
};

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
          description: "Hemos recibido tu sugerencia. ¡Pronto la evaluaremos!",
        });
        setRecommendation("");
      } catch (error) {
        console.error("Error al enviar recomendación:", error);
        toast({
          title: "Error",
          description: "No pudimos guardar tu sugerencia. Inténtalo más tarde.",
          variant: "destructive"
        });
      } finally {
        setIsSubmittingRecLocal(false);
      }
    }
  };

  const hasResults = Object.keys(groupedServices).length > 0;

  return (
    <div className="flex flex-col min-h-screen pt-20">
      <main className="flex-grow w-full max-w-2xl mx-auto pb-32 px-4 space-y-10">
        
        {/* SALUDO Y BOTÓN PRINCIPAL */}
        <section className="space-y-6">
          <div className="px-2">
            <h1 className="text-sm font-bold text-on-surface/40 uppercase tracking-[0.2em] mb-1">
              Bienvenido de nuevo
            </h1>
            <h2 className="text-3xl font-sora font-extrabold text-on-surface">
              Hola, {user?.displayName?.split(' ')[0] || 'Deyvid'} 👋
            </h2>
          </div>
          
          <Link href="/compartir" className="block group">
            <div className="relative overflow-hidden w-full h-16 bg-gradient-to-r from-primary to-[#ff6b6b] rounded-[2rem] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <PlusCircle className="h-6 w-6 text-white" />
              <span className="text-white font-bold text-lg tracking-tight">Compartir una suscripción</span>
            </div>
          </Link>
        </section>

        {/* NOVEDADES - GLASS STYLE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-on-surface">Novedades</h2>
          </div>
          <div className="glass-card rounded-[2rem] p-5 flex items-center justify-between transition-all hover:bg-white/60 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner overflow-hidden border border-white/20">
                <Image src="https://picsum.photos/seed/novedades/200/200" alt="Novedad" width={40} height={40} className="object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">SubShare Mundial 2026</h3>
                <p className="text-[11px] text-on-surface-variant font-medium">Vive la emoción del fútbol pro</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </section>

        {/* MIS GRUPOS - COMPACT GLASS */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-lg font-bold text-on-surface">Mis Grupos</h2>
            <Link href="/mis-grupos" className="text-[10px] font-black text-primary hover:opacity-70 transition-colors uppercase tracking-[0.2em]">VER TODO</Link>
          </div>
          {groups.slice(0, 1).map((group) => (
            <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block group">
              <div className="glass-card rounded-[2rem] p-5 flex items-center justify-between hover:bg-white/60 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center border border-white/20">
                    <Image src={`https://picsum.photos/seed/${group.id}/100/100`} alt={group.service} width={30} height={30} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface leading-tight">{group.service}</h3>
                    <p className="text-[11px] text-on-surface-variant font-medium">{group.slots.filled} cupos compartidos</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center group-hover:translate-x-1 transition-all">
                  <ChevronRight className="h-4 w-4 text-on-surface-variant" />
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* IA & HERRAMIENTAS - MINI GLASS CARDS */}
        <section className="space-y-6">
          {hasResults ? (
            Object.entries(groupedServices).map(([slug, services]) => (
              <div key={slug} className="space-y-5">
                <div className="px-2">
                  <h2 className="text-xl font-sora font-bold tracking-tight text-on-surface">
                    {categoryLabels[slug] || slug}
                  </h2>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {services.map((service) => {
                    const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
                    const isPerplexity = service.id === 'perplexity';
                    const isGemini = service.id === 'gemini';
                    
                    const brandColor = isPerplexity ? "text-[#1adec5]" : (isGemini ? "text-primary" : (isWhiteBg ? "text-primary" : "text-white"));
                    const planColor = isWhiteBg ? "text-on-surface-variant/60" : "text-white/70";
                    const labelColor = isWhiteBg ? "text-on-surface-variant/40" : "text-white/60";
                    
                    return (
                      <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                        <div 
                          className={cn(
                            "relative rounded-[2rem] p-4 aspect-[4/5] flex flex-col justify-between transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl active:scale-95 overflow-hidden",
                            isWhiteBg ? "glass-card" : "shadow-lg shadow-black/10"
                          )}
                          style={{ backgroundColor: !isWhiteBg ? (service.color || '#4343d5') : undefined }}
                        >
                          {!isWhiteBg && <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />}
                          
                          {service.discount && (
                            <div className="absolute top-3 right-3 bg-black/10 backdrop-blur-md w-7 h-7 rounded-full flex items-center justify-center z-10 border border-white/10">
                              <span className={cn("text-[8px] font-bold", brandColor)}>
                                {service.discount}
                              </span>
                            </div>
                          )}

                          <div className="relative z-10 space-y-1">
                            <h3 className={cn(
                              "text-[12px] font-bold tracking-tight leading-none pr-4",
                              brandColor
                            )}>
                              {service.name}
                            </h3>
                            <p className={cn(
                              "text-[9px] font-medium opacity-80",
                              planColor
                            )}>
                              {service.planName || "PREMIUM"}
                            </p>
                          </div>

                          <div className="relative z-10 space-y-1">
                            <p className={cn(
                              "text-[8px] font-black uppercase tracking-[0.1em]",
                              labelColor
                            )}>
                              DESDE
                            </p>
                            <div className="flex items-baseline gap-0.5">
                              <span className={cn(
                                "text-base font-sora font-extrabold tracking-tight",
                                brandColor
                              )}>
                                S/ {service.pricePerMonth}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          ) : null}
        </section>

        {/* SUGERENCIAS - LIQUID FORM */}
        <section className="glass-card rounded-[2.5rem] p-10 text-center space-y-6 border border-white/60">
          <div className="space-y-2">
            <h2 className="text-xs font-black text-on-surface leading-tight uppercase tracking-[0.3em]">
              ¿BUSCAS ALGO MÁS?
            </h2>
            <p className="text-[11px] text-on-surface-variant font-medium max-w-[220px] mx-auto leading-relaxed">
              Dinos qué IA necesitas y la traeremos para ti de inmediato.
            </p>
          </div>
          <div className="max-w-[260px] mx-auto space-y-4">
            <input 
              className="w-full bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl h-14 text-sm font-bold shadow-inner focus-visible:ring-2 focus-visible:ring-primary/20 px-6 placeholder:opacity-40 text-center outline-none transition-all" 
              placeholder="EJ: MIDJOURNEY..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRecLocal}
            />
            <p className="text-[8px] text-on-surface-variant/40 font-black uppercase tracking-[0.4em]">PRESIONA ENTER</p>
          </div>
        </section>
      </main>
    </div>
  );
}
