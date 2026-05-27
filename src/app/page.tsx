
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
import { ChevronRight, PlusCircle } from "lucide-react";
import type { CategorySlug, Service } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  ia: "Inteligencia Artificial",
};

export default function Home() {
  const [recommendation, setRecommendation] = useState("");
  const [isSubmittingRecLocal, setIsSubmittingRecLocal] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const user = auth?.currentUser;

  // Solo mostramos categorías que tengan al menos un servicio
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
    <div className="flex flex-col min-h-screen bg-[#F5F5F9]">
      <main className="flex-grow w-full max-w-[1280px] mx-auto pb-24 px-4">
        {/* SALUDO Y BOTÓN COMPARTIR */}
        <section className="pt-4 space-y-4">
          <div className="px-1">
            <h1 className="text-base font-medium text-on-surface">
              Hola, {user?.displayName?.split(' ')[0] || 'Deyvid'} 👋
            </h1>
          </div>
          
          <Link href="/compartir" className="block">
            <div className="w-full h-14 bg-gradient-to-r from-[#4343d5] to-[#f4511e] rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all">
              <PlusCircle className="h-6 w-6 text-white" />
              <span className="text-white font-bold text-lg tracking-tight">Compartir una suscripción</span>
            </div>
          </Link>
        </section>

        {/* NOVEDADES */}
        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-bold text-on-surface px-1">Novedades</h2>
          <div className="relative overflow-hidden rounded-2xl border-none bg-white shadow-sm transition-transform active:scale-[0.98]">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                  <Image src="https://picsum.photos/seed/novedades/100/100" alt="Novedad" width={24} height={24} className="rounded-md" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-on-surface leading-tight">Lank Mundial 2026</h3>
                  <p className="text-[9px] text-on-surface-variant">Prode, resultados y más</p>
                </div>
              </div>
              <ChevronRight className="h-3 w-3 text-on-surface-variant/20" />
            </div>
            <div className="bg-[#ff4d00] py-1 px-4 text-center">
              <p className="text-[8px] font-bold text-white uppercase tracking-wider">El mejor lugar para vivir el mundial</p>
            </div>
          </div>
        </section>

        {/* MIS GRUPOS */}
        <section className="mt-8 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-bold text-on-surface">Mis Grupos</h2>
            <Link href="/mis-grupos" className="text-[8px] font-bold text-primary hover:opacity-70 transition-colors uppercase tracking-wider">VER TODO</Link>
          </div>
          {groups.slice(0, 1).map((group) => (
            <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block">
              <div className="p-4 flex items-center justify-between rounded-2xl border-none bg-white shadow-sm active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                    <Image src={`https://picsum.photos/seed/${group.id}/100/100`} alt={group.service} width={22} height={22} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface leading-tight">{group.service}</h3>
                    <p className="text-[9px] text-on-surface-variant">{group.slots.filled} cupos compartidos</p>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 text-on-surface-variant/20" />
              </div>
            </Link>
          ))}
        </section>

        {/* IA & HERRAMIENTAS - SOLO CATEGORÍAS CON CONTENIDO */}
        <section className="mt-10 space-y-6">
          {hasResults ? (
            Object.entries(groupedServices).map(([slug, services]) => (
              <div key={slug} className="space-y-4">
                <div className="px-1">
                  <h2 className="text-lg font-bold tracking-tight text-on-surface leading-tight">
                    {categoryLabels[slug] || slug}
                  </h2>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
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
                            "relative rounded-2xl p-3 aspect-[4/5] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 shadow-sm overflow-hidden border-none",
                            isWhiteBg && "shadow-[0_2px_10px_rgb(0,0,0,0.04)]"
                          )}
                          style={{ backgroundColor: service.color || '#4343d5' }}
                        >
                          {service.discount && (
                            <div className="absolute top-2 right-2 bg-black/10 backdrop-blur-md w-6 h-6 rounded-full flex items-center justify-center z-10 border border-white/10">
                              <span className={cn("text-[7px] font-bold", brandColor)}>
                                {service.discount}
                              </span>
                            </div>
                          )}

                          <div className="space-y-0.5">
                            <h3 className={cn(
                              "text-[11px] font-bold tracking-tight leading-none pr-4 truncate",
                              brandColor
                            )}>
                              {service.name}
                            </h3>
                            <p className={cn(
                              "text-[8px] font-medium opacity-80",
                              planColor
                            )}>
                              {service.planName || "PREMIUM"}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <p className={cn(
                              "text-[7px] font-bold uppercase tracking-widest",
                              labelColor
                            )}>
                              DESDE
                            </p>
                            <div className="flex items-baseline gap-0.5">
                              <span className={cn(
                                "text-sm font-bold tracking-tight",
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

        {/* SUGERENCIAS */}
        <section className="mt-8 py-8 text-center space-y-4 bg-white/50 rounded-3xl border border-white shadow-inner">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-on-surface leading-tight uppercase tracking-tight">
              ¿BUSCAS OTRA HERRAMIENTA?
            </h2>
            <p className="text-[9px] text-on-surface-variant/60 font-medium max-w-[180px] mx-auto leading-relaxed">
              Dinos qué IA necesitas y la traeremos para ti de inmediato.
            </p>
          </div>
          <div className="max-w-[240px] mx-auto px-4">
            <Input 
              className="w-full bg-white border-none rounded-lg h-10 text-xs font-medium shadow-sm focus-visible:ring-primary px-4 placeholder:opacity-40 text-center" 
              placeholder="EJ: MIDJOURNEY, FIREFLY..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRecLocal}
            />
            <p className="mt-3 text-[7px] text-on-surface-variant/40 font-bold uppercase tracking-[0.2em]">PRESIONA ENTER PARA ENVIAR</p>
          </div>
        </section>
      </main>
    </div>
  );
}
