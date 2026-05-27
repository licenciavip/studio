
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
import { ChevronRight, Search } from "lucide-react";
import type { CategorySlug, Service } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  ia: "Inteligencia Artificial",
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
        <section className="pt-4">
          <div className="relative flex items-center group">
            <div className="absolute left-4 flex items-center justify-center pointer-events-none">
              <Search className="h-5 w-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            </div>
            <Input 
              className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl focus-visible:ring-primary transition-all text-sm placeholder:text-on-surface-variant/20 shadow-sm h-12" 
              placeholder="¿Qué servicio de IA buscas?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        <section className="mt-8 space-y-6">
          {hasResults ? (
            Object.entries(groupedServices).map(([slug, services]) => (
              <div key={slug} className="space-y-4">
                <div className="px-1">
                  <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                    {categoryLabels[slug] || slug}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                  {services.map((service) => {
                    const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
                    const isPerplexity = service.id === 'perplexity';
                    const isGemini = service.id === 'gemini';
                    
                    const brandColor = isPerplexity ? "text-[#1adec5]" : (isWhiteBg ? "text-primary" : "text-white");
                    const textColor = isWhiteBg ? "text-on-surface" : "text-white";
                    const planColor = isWhiteBg ? "text-on-surface-variant/80" : "text-white/80";
                    const labelColor = isWhiteBg ? "text-on-surface-variant/60" : "text-white/60";
                    
                    return (
                      <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                        <div 
                          className={cn(
                            "relative rounded-[1.5rem] p-4 aspect-[4/5] flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-md overflow-hidden border-none",
                            isWhiteBg && "shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
                          )}
                          style={{ backgroundColor: service.color || '#4343d5' }}
                        >
                          {/* Discount Badge */}
                          {service.discount && (
                            <div className="absolute top-3 right-3 bg-black/10 backdrop-blur-md px-1.5 py-0.5 rounded-full z-10">
                              <span className={cn(
                                "text-[8px] font-bold",
                                isPerplexity ? "text-[#1adec5]" : (isWhiteBg ? "text-primary" : "text-white")
                              )}>
                                {service.discount}
                              </span>
                            </div>
                          )}

                          <div className="space-y-0.5">
                            <h3 className={cn(
                              "text-base font-bold tracking-tight leading-none",
                              brandColor
                            )}>
                              {service.name}
                            </h3>
                            <p className={cn(
                              "text-[9px] font-medium",
                              planColor
                            )}>
                              {service.planName || "PREMIUM"}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className={cn(
                              "text-[8px] font-medium uppercase tracking-wider",
                              labelColor
                            )}>
                              Planes desde
                            </p>
                            <div className="flex items-baseline gap-0.5">
                              <span className={cn(
                                "text-lg font-bold tracking-tight",
                                brandColor
                              )}>
                                S/ {service.pricePerMonth}
                              </span>
                              <span className={cn(
                                "text-[9px] font-medium opacity-40",
                                textColor
                              )}>
                                /mes
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

        <section className="mt-12 space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-on-surface px-1">Novedades</h2>
            <div className="relative overflow-hidden rounded-[2rem] border-none bg-white shadow-sm transition-transform active:scale-[0.98]">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center">
                    <Image src="https://picsum.photos/seed/novedades/100/100" alt="Novedad" width={32} height={32} className="rounded-lg" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface leading-tight">Lank Mundial 2026</h3>
                    <p className="text-[10px] text-on-surface-variant">Prode, resultados y más</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-on-surface-variant/20" />
              </div>
              <div className="bg-[#ff4d00] py-1.5 px-4 text-center">
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">El mejor lugar para vivir el mundial</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-xl font-bold text-on-surface">Mis Grupos</h2>
              <Link href="/mis-grupos" className="text-[10px] font-bold text-primary hover:opacity-70 transition-colors uppercase">VER TODO</Link>
            </div>
            {groups.slice(0, 1).map((group) => (
              <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block">
                <div className="p-4 flex items-center justify-between rounded-[2rem] border-none bg-white shadow-sm active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center">
                      <Image src={`https://picsum.photos/seed/${group.id}/100/100`} alt={group.service} width={24} height={24} className="object-contain" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface leading-tight">{group.service}</h3>
                      <p className="text-[10px] text-on-surface-variant">{group.slots.filled} cupos compartidos</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-on-surface-variant/20" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 py-12 text-center space-y-6 bg-white/50 rounded-[3rem] border border-white shadow-inner">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-on-surface leading-tight">
              ¿BUSCAS OTRA HERRAMIENTA?
            </h2>
            <p className="text-[10px] text-on-surface-variant/60 font-medium max-w-[200px] mx-auto">
              Dinos qué IA necesitas y la traeremos para ti.
            </p>
          </div>
          <div className="max-w-xs mx-auto px-4">
            <Input 
              className="w-full bg-white border-none rounded-2xl h-11 text-sm font-medium shadow-sm focus-visible:ring-primary px-6 placeholder:opacity-40 text-center" 
              placeholder="EJ: MIDJOURNEY, FIREFLY..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRecLocal}
            />
            <p className="mt-4 text-[9px] text-on-surface-variant/40 font-bold uppercase tracking-widest">PRESIONA ENTER PARA ENVIAR</p>
          </div>
        </section>
      </main>
    </div>
  );
}
