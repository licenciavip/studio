
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { servicesByCategory, groups } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight } from "lucide-react";
import type { CategorySlug, Service } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  ia: "INTELIGENCIA ARTIFICIAL",
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isSubmittingRecLocal, setIsSubmittingRecLocal] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const groupedServices = useMemo(() => {
    const result: Record<string, Service[]> = {};
    const query = searchQuery.toLowerCase();

    Object.entries(servicesByCategory).forEach(([slug, services]) => {
      const filtered = services.filter(s => s.name.toLowerCase().includes(query));
      if (filtered.length > 0) {
        result[slug] = filtered;
      }
    });
    return result;
  }, [searchQuery]);

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
        {/* Búsqueda */}
        <section className="pt-6">
          <div className="relative flex items-center group">
            <div className="absolute left-4 flex items-center justify-center pointer-events-none">
              <span className="material-symbols-outlined text-outline/70 group-focus-within:text-primary transition-colors text-lg">
                search
              </span>
            </div>
            <Input 
              className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-2xl focus-visible:ring-primary transition-all text-xs placeholder:text-outline/40 shadow-sm h-12" 
              placeholder="¿Qué servicio de IA buscas?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Galería de Servicios IA */}
        <section className="mt-10 space-y-12">
          {hasResults ? (
            Object.entries(groupedServices).map(([slug, services]) => (
              <div key={slug} className="space-y-6">
                <div className="px-2">
                  <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30">
                    {categoryLabels[slug] || slug.toUpperCase()}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {services.map((service) => {
                    const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
                    const textColor = isWhiteBg ? "text-[#000839]" : "text-white";
                    
                    return (
                      <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                        <div 
                          className={cn(
                            "relative rounded-[2rem] p-4 aspect-square flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-lg overflow-hidden border-none",
                            isWhiteBg && "shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                          )}
                          style={{ backgroundColor: service.color || '#4343d5' }}
                        >
                          {/* Top part */}
                          <div className="space-y-0.5">
                            <h3 className={cn(
                              "font-sora font-black text-[0.9rem] uppercase tracking-tighter leading-none",
                              textColor
                            )}>
                              {service.name}
                            </h3>
                            <p className={cn(
                              "text-[6px] font-black uppercase tracking-tighter opacity-70",
                              textColor
                            )}>
                              {service.planName || "PREMIUM"}
                            </p>
                          </div>

                          {/* Bottom part */}
                          <div className="space-y-0">
                            <p className={cn(
                              "text-[6px] font-black uppercase tracking-widest opacity-60",
                              textColor
                            )}>
                              DESDE
                            </p>
                            <div className="flex items-baseline gap-0.5">
                              <span className={cn(
                                "text-[0.85rem] font-sora font-black tracking-tighter",
                                textColor
                              )}>
                                S/{service.pricePerMonth || "15.90"}
                              </span>
                              <span className={cn(
                                "text-[6px] font-black uppercase opacity-40",
                                textColor
                              )}>
                                /MES
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
          ) : (
            <div className="py-20 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-2 border-dashed rounded-[3rem] border-outline-variant/30">
              SIN RESULTADOS
            </div>
          )}
        </section>

        {/* Novedades y Mis Grupos */}
        <section className="mt-14 space-y-10">
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 px-2">NOVEDADES</h2>
            <div className="relative overflow-hidden rounded-[2.2rem] border-none bg-white shadow-sm transition-transform active:scale-[0.98]">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
                    <Image src="https://picsum.photos/seed/novedades/100/100" alt="Novedad" width={40} height={40} className="rounded-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-on-surface leading-tight uppercase">Lank Mundial 2026</h3>
                    <p className="text-[10px] font-medium text-on-surface-variant opacity-60">Prode, resultados y más</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-outline-variant/50" />
              </div>
              <div className="bg-[#ff4d00] py-1.5 px-4 text-center">
                <p className="text-[8px] font-black text-white uppercase tracking-widest">El mejor lugar para vivir el mundial</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">MIS GRUPOS</h2>
              <Link href="/mis-grupos" className="text-[9px] font-black text-primary hover:opacity-70 transition-colors uppercase tracking-widest">VER TODO</Link>
            </div>
            {groups.slice(0, 1).map((group) => (
              <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block">
                <div className="p-5 flex items-center justify-between rounded-[2.2rem] border-none bg-white shadow-sm active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
                      <Image src={`https://picsum.photos/seed/${group.id}/100/100`} alt={group.service} width={28} height={28} className="object-contain" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-on-surface leading-tight uppercase">{group.service}</h3>
                      <p className="text-[10px] font-medium text-on-surface-variant opacity-60">{group.slots.filled} cupos compartidos</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-outline-variant/50" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sección de Recomendaciones */}
        <section className="mt-16 py-14 text-center space-y-7 bg-white/50 rounded-[3rem] border border-white shadow-inner">
          <div className="space-y-2">
            <h2 className="text-xl font-sora font-black text-on-surface leading-tight uppercase tracking-tighter">
              ¿BUSCAS OTRA HERRAMIENTA?
            </h2>
            <p className="text-[9px] text-on-surface-variant/50 font-black uppercase tracking-widest max-w-[240px] mx-auto">
              Dinos qué IA necesitas y la traeremos para ti.
            </p>
          </div>
          <div className="max-w-xs mx-auto px-4">
            <Input 
              className="w-full bg-white border-none rounded-2xl h-12 text-[11px] font-bold shadow-sm focus-visible:ring-primary px-6 placeholder:font-black placeholder:opacity-20 text-center" 
              placeholder="EJ: MIDJOURNEY, FIREFLY..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRecLocal}
            />
            <p className="mt-5 text-[8px] text-muted-foreground/40 font-black uppercase tracking-[0.25em]">PRESIONA ENTER PARA ENVIAR</p>
          </div>
        </section>
      </main>
    </div>
  );
}
