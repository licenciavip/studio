"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
          description: "Hemos recibido tu sugerencia.",
        });
        setRecommendation("");
      } catch (error) {
        console.error("Error al enviar recomendación:", error);
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
    <div className="flex flex-col min-h-screen pt-24">
      <main className="flex-grow w-full max-w-xl mx-auto pb-40 px-6 space-y-12">
        
        {/* SALUDO Y BOTÓN PRINCIPAL */}
        <section className="space-y-8">
          <div className="px-1 space-y-1">
            <h1 className="text-[10px] font-black text-on-surface/30 uppercase tracking-[0.2em]">
              Bienvenido de nuevo
            </h1>
            <h2 className="text-3xl font-bold text-on-surface tracking-tighter">
              Hola, {user?.displayName?.split(' ')[0] || 'Deyvid'} 👋
            </h2>
          </div>
          
          <Link href="/compartir" className="block group">
            <div className="relative overflow-hidden w-full h-20 bg-gradient-to-br from-[#5d5fef] to-[#ff6b6b] rounded-[2.2rem] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(93,95,239,0.15)] transition-all duration-500 hover:scale-[1.01] active:scale-[0.97]">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Compartir una suscripción</span>
            </div>
          </Link>
        </section>

        {/* NOVEDADES - GLASS STYLE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Sparkles className="h-4 w-4 text-primary/60" />
            <h2 className="text-sm font-bold text-on-surface/80 tracking-tight">Novedades</h2>
          </div>
          <div className="glass-card rounded-[2.5rem] p-6 flex items-center justify-between transition-all hover:bg-white/40 group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-sm overflow-hidden border border-white/30">
                <Image src="https://picsum.photos/seed/novedades/200/200" alt="Novedad" width={56} height={56} className="object-cover" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-on-surface tracking-tight">SubShare Mundial 2026</h3>
                <p className="text-xs text-on-surface-variant/70 font-medium">Vive la emoción del fútbol pro</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* MIS GRUPOS - COMPACT GLASS */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-sm font-bold text-on-surface/80 tracking-tight">Mis Grupos</h2>
            <Link href="/mis-grupos" className="text-[10px] font-black text-primary/60 hover:text-primary transition-colors uppercase tracking-[0.15em]">VER TODO</Link>
          </div>
          {groups.slice(0, 1).map((group) => (
            <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block group">
              <div className="glass-card rounded-[2.5rem] p-6 flex items-center justify-between hover:bg-white/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 shadow-sm">
                    <Image src={`https://picsum.photos/seed/${group.id}/100/100`} alt={group.service} width={32} height={32} className="object-contain" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-on-surface leading-tight tracking-tight">{group.service}</h3>
                    <p className="text-xs text-on-surface-variant/70 font-medium">{group.slots.filled} cupos vendidos</p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center group-hover:translate-x-1 transition-all shadow-sm">
                  <ChevronRight className="h-5 w-5 text-on-surface-variant/40" />
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* IA & HERRAMIENTAS - MINI GLASS CARDS */}
        <section className="space-y-6">
          {Object.entries(groupedServices).map(([slug, services]) => (
            <div key={slug} className="space-y-5">
              <div className="px-2">
                <h2 className="text-xl font-bold tracking-tighter text-on-surface">
                  {categoryLabels[slug] || slug}
                </h2>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {services.map((service) => {
                  const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
                  const isPerplexity = service.id === 'perplexity';
                  const isGemini = service.id === 'gemini';
                  
                  const brandColor = isPerplexity ? "text-[#1adec5]" : (isGemini ? "text-primary" : (isWhiteBg ? "text-primary" : "text-white"));
                  const planColor = isWhiteBg ? "text-on-surface-variant/40" : "text-white/60";
                  const labelColor = isWhiteBg ? "text-on-surface-variant/30" : "text-white/40";
                  
                  return (
                    <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                      <div 
                        className={cn(
                          "relative rounded-[1.8rem] p-4 aspect-[4/5] flex flex-col justify-between transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-[0.98] overflow-hidden border border-white/10",
                          isWhiteBg ? "glass-card" : "shadow-lg shadow-black/5"
                        )}
                        style={{ backgroundColor: !isWhiteBg ? (service.color || '#4343d5') : undefined }}
                      >
                        {!isWhiteBg && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}
                        
                        <div className="relative z-10 space-y-0.5">
                          <h3 className={cn(
                            "text-[12px] font-bold tracking-tight leading-tight pr-2",
                            brandColor
                          )}>
                            {service.name}
                          </h3>
                          <p className={cn(
                            "text-[8px] font-medium tracking-tight",
                            planColor
                          )}>
                            {service.planName || "PREMIUM"}
                          </p>
                        </div>

                        <div className="relative z-10 space-y-0.5">
                          <p className={cn(
                            "text-[7px] font-black uppercase tracking-widest opacity-60",
                            labelColor
                          )}>
                            DESDE
                          </p>
                          <div className="flex items-baseline gap-0.5">
                            <span className={cn(
                              "text-sm font-bold tracking-tighter",
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
          ))}
        </section>

        {/* SUGERENCIAS - LIQUID FORM */}
        <section className="glass-card rounded-[2.5rem] p-10 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-[10px] font-black text-on-surface/30 uppercase tracking-[0.4em]">
              ¿BUSCAS ALGO MÁS?
            </h2>
            <p className="text-sm text-on-surface-variant/80 font-medium max-w-[240px] mx-auto leading-relaxed tracking-tight">
              Dinos qué IA necesitas y la traeremos para ti.
            </p>
          </div>
          <div className="max-w-[280px] mx-auto space-y-4">
            <input 
              className="w-full bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl h-14 text-sm font-bold shadow-inner focus:ring-2 focus:ring-primary/20 px-6 placeholder:opacity-30 text-center outline-none transition-all tracking-tight" 
              placeholder="EJ: MIDJOURNEY..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRecLocal}
            />
            <p className="text-[8px] text-on-surface-variant/30 font-black uppercase tracking-[0.4em]">PRESIONA ENTER</p>
          </div>
        </section>
      </main>
    </div>
  );
}
