
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
        <section className="pt-6">
          <div className="relative flex items-center group">
            <div className="absolute left-4 flex items-center justify-center pointer-events-none">
              <span className="material-symbols-outlined text-on-surface-variant/40 group-focus-within:text-primary transition-colors text-lg">
                search
              </span>
            </div>
            <Input 
              className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-2xl focus-visible:ring-primary transition-all text-[11px] placeholder:text-on-surface-variant/20 shadow-sm h-12" 
              placeholder="¿Qué servicio de IA buscas?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        <section className="mt-10 space-y-12">
          {hasResults ? (
            Object.entries(groupedServices).map(([slug, services]) => (
              <div key={slug} className="space-y-6">
                <div className="px-2">
                  <h2 className="text-[9px] font-normal uppercase tracking-[0.3em] text-on-surface-variant/40">
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
                            "relative rounded-[2rem] p-6 aspect-square flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-lg overflow-hidden border-none",
                            isWhiteBg && "shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                          )}
                          style={{ backgroundColor: service.color || '#4343d5' }}
                        >
                          <div className="space-y-0.5">
                            <h3 className={cn(
                              "text-[0.95rem] font-normal uppercase tracking-tighter leading-none",
                              textColor
                            )}>
                              {service.name}
                            </h3>
                            <p className={cn(
                              "text-[8px] font-normal uppercase tracking-tighter opacity-70",
                              textColor
                            )}>
                              {service.planName || "PREMIUM"}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <p className={cn(
                              "text-[8px] font-normal uppercase tracking-widest opacity-60",
                              textColor
                            )}>
                              DESDE
                            </p>
                            <div className="flex items-baseline gap-0.5">
                              <span className={cn(
                                "text-[0.95rem] font-normal tracking-tighter leading-none",
                                textColor
                              )}>
                                S/{service.pricePerMonth || "15.90"}
                              </span>
                              <span className={cn(
                                "text-[8px] font-normal uppercase opacity-40 ml-0.5",
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
            <div className="py-20 text-center text-on-surface-variant/20 text-[9px] font-normal uppercase tracking-[0.3em] border-2 border-dashed rounded-[3rem] border-outline-variant/30">
              SIN RESULTADOS
            </div>
          )}
        </section>

        <section className="mt-14 space-y-10">
          <div className="space-y-4">
            <h2 className="text-[9px] font-normal uppercase tracking-[0.3em] text-on-surface-variant/40 px-2">NOVEDADES</h2>
            <div className="relative overflow-hidden rounded-[2rem] border-none bg-white shadow-sm transition-transform active:scale-[0.98]">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
                    <Image src="https://picsum.photos/seed/novedades/100/100" alt="Novedad" width={40} height={40} className="rounded-lg" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-normal text-on-surface leading-tight uppercase tracking-tight">Lank Mundial 2026</h3>
                    <p className="text-[9px] font-normal text-on-surface-variant opacity-40">Prode, resultados y más</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-on-surface-variant/20" />
              </div>
              <div className="bg-[#ff4d00] py-1.5 px-4 text-center">
                <p className="text-[7px] font-normal text-white uppercase tracking-[0.2em]">El mejor lugar para vivir el mundial</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-[9px] font-normal uppercase tracking-[0.3em] text-on-surface-variant/40">MIS GRUPOS</h2>
              <Link href="/mis-grupos" className="text-[8px] font-normal text-primary hover:opacity-70 transition-colors uppercase tracking-[0.2em]">VER TODO</Link>
            </div>
            {groups.slice(0, 1).map((group) => (
              <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block">
                <div className="p-5 flex items-center justify-between rounded-[2rem] border-none bg-white shadow-sm active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
                      <Image src={`https://picsum.photos/seed/${group.id}/100/100`} alt={group.service} width={28} height={28} className="object-contain" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-normal text-on-surface leading-tight uppercase tracking-tight">{group.service}</h3>
                      <p className="text-[9px] font-normal text-on-surface-variant opacity-40">{group.slots.filled} cupos compartidos</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-on-surface-variant/20" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 py-14 text-center space-y-7 bg-white/50 rounded-[3rem] border border-white shadow-inner">
          <div className="space-y-2">
            <h2 className="text-[14px] font-normal text-on-surface leading-tight uppercase tracking-tight">
              ¿BUSCAS OTRA HERRAMIENTA?
            </h2>
            <p className="text-[8px] text-on-surface-variant/40 font-normal uppercase tracking-[0.2em] max-w-[240px] mx-auto">
              Dinos qué IA necesitas y la traeremos para ti.
            </p>
          </div>
          <div className="max-w-xs mx-auto px-4">
            <Input 
              className="w-full bg-white border-none rounded-2xl h-12 text-[10px] font-normal shadow-sm focus-visible:ring-primary px-6 placeholder:opacity-20 text-center" 
              placeholder="EJ: MIDJOURNEY, FIREFLY..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRecLocal}
            />
            <p className="mt-5 text-[7px] text-on-surface-variant/20 font-normal uppercase tracking-[0.3em]">PRESIONA ENTER PARA ENVIAR</p>
          </div>
        </section>
      </main>
    </div>
  );
}
