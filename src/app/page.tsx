
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

const categories = [
  { label: "TODO", slug: "all" },
  { label: "IA", slug: "ia" },
];

const categoryLabels: Record<string, string> = {
  ia: "INTELIGENCIA ARTIFICIAL",
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isSubmittingRec, setIsSubmittingRec] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const groupedServices = useMemo(() => {
    const result: Record<string, Service[]> = {};
    const query = searchQuery.toLowerCase();

    if (selectedCategory === "all") {
      Object.entries(servicesByCategory).forEach(([slug, services]) => {
        const filtered = services.filter(s => s.name.toLowerCase().includes(query));
        if (filtered.length > 0) {
          result[slug] = filtered;
        }
      });
    } else {
      const services = servicesByCategory[selectedCategory as CategorySlug] || [];
      const filtered = services.filter(s => s.name.toLowerCase().includes(query));
      if (filtered.length > 0) {
        result[selectedCategory] = filtered;
      }
    }
    return result;
  }, [selectedCategory, searchQuery]);

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

      setIsSubmittingRec(true);
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
        setIsSubmittingRec(false);
      }
    }
  };

  const hasResults = Object.keys(groupedServices).length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-[1280px] mx-auto pb-24">
        {/* Búsqueda */}
        <section className="px-4 pt-4">
          <div className="relative flex items-center group">
            <div className="absolute left-4 flex items-center justify-center pointer-events-none">
              <span className="material-symbols-outlined text-outline/70 group-focus-within:text-primary transition-colors text-lg">
                search
              </span>
            </div>
            <Input 
              className="w-full pl-10 pr-4 py-3 bg-white border-outline-variant/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary transition-all text-xs placeholder:text-outline/50 shadow-sm h-10" 
              placeholder="¿Qué servicio de IA buscas?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Novedades Section */}
        <section className="mt-6 px-4 space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-1 opacity-60">NOVEDADES</h2>
          <div className="relative overflow-hidden rounded-[1.5rem] border border-outline-variant/30 bg-white shadow-sm transition-transform active:scale-[0.98]">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                   <Image src="https://picsum.photos/seed/novedades/100/100" alt="Novedad" width={32} height={32} className="rounded-md" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-on-surface leading-tight uppercase">Lank Mundial 2026</h3>
                  <p className="text-[10px] font-medium text-on-surface-variant">Prode, resultados y más</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-outline-variant" />
            </div>
            <div className="bg-[#ff4d00] py-1 px-4">
              <p className="text-[8px] font-black text-white uppercase tracking-widest">El mejor lugar para vivir el mundial</p>
            </div>
          </div>
        </section>

        {/* Mis Grupos Section */}
        <section className="mt-6 px-4 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60">MIS GRUPOS</h2>
            <Link href="/mis-grupos" className="text-[9px] font-black text-primary hover:opacity-70 transition-colors uppercase tracking-widest">VER TODO</Link>
          </div>
          <div className="space-y-2">
            {groups.slice(0, 1).map((group) => (
              <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block">
                <div className="p-4 flex items-center justify-between rounded-[1.5rem] border border-outline-variant/30 bg-white shadow-sm active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                      <Image src={`https://picsum.photos/seed/${group.id}/100/100`} alt={group.service} width={24} height={24} className="object-contain" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-on-surface leading-tight uppercase">{group.service}</h3>
                      <p className="text-[10px] font-medium text-on-surface-variant">{group.slots.filled} cupos compartidos</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-outline-variant" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Galería de Servicios IA */}
        <section className="mt-8 px-4 space-y-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <Button 
                key={cat.slug}
                variant={selectedCategory === cat.slug ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "rounded-full px-5 whitespace-nowrap active:scale-95 transition-transform h-8 text-[10px] font-black uppercase tracking-widest shadow-sm",
                  selectedCategory === cat.slug ? "bg-primary text-white" : "bg-white text-on-surface-variant border border-outline-variant/30"
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {hasResults ? (
            Object.entries(groupedServices).map(([slug, services]) => (
              <div key={slug} className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant opacity-50">
                    {categoryLabels[slug] || slug.toUpperCase()}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {services.map((service) => {
                    const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
                    return (
                      <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                        <div 
                          className={cn(
                            "relative rounded-[2.2rem] p-5 aspect-[4/5] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border",
                            isWhiteBg ? "border-outline-variant/40" : "border-white/10"
                          )}
                          style={{ backgroundColor: service.color || '#4343d5' }}
                        >
                          <div className="space-y-1">
                            <h3 className={cn(
                              "font-sora font-black text-2xl uppercase tracking-tighter leading-[0.9]",
                              isWhiteBg ? "text-on-surface" : "text-white"
                            )}>
                              {service.name}
                            </h3>
                            <p className={cn(
                              "text-[9px] font-black uppercase tracking-wider opacity-70",
                              isWhiteBg ? "text-on-surface-variant" : "text-white"
                            )}>
                              {service.planName || "PREMIUM"}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <p className={cn(
                              "text-[9px] font-black uppercase tracking-[0.1em] opacity-60",
                              isWhiteBg ? "text-on-surface-variant" : "text-white"
                            )}>
                              DESDE
                            </p>
                            <div className="flex items-baseline gap-0.5">
                              <span className={cn(
                                "text-[1.35rem] font-sora font-black tracking-tighter",
                                isWhiteBg ? "text-on-surface" : "text-white"
                              )}>
                                S/ {service.pricePerMonth || "15.90"}
                              </span>
                              <span className={cn(
                                "text-[9px] font-black opacity-40",
                                isWhiteBg ? "text-on-surface-variant" : "text-white"
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
            <div className="py-12 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-2 border-dashed rounded-[2rem] border-outline-variant/30">
              SIN RESULTADOS
            </div>
          )}
        </section>

        {/* Sección de Recomendaciones */}
        <section className="mt-12 px-4 py-12 text-center space-y-6 bg-surface-container/30 rounded-[2.5rem] mx-4 border border-outline-variant/10 shadow-inner">
          <div className="space-y-1.5">
            <h2 className="text-xl font-sora font-black text-on-surface leading-tight uppercase tracking-tighter">
              ¿BUSCAS OTRA Herramienta?
            </h2>
            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest max-w-[220px] mx-auto opacity-50">
              Dinos qué IA necesitas y la traeremos para ti.
            </p>
          </div>
          <div className="max-w-xs mx-auto">
            <Input 
              className="w-full bg-white border-outline-variant rounded-2xl h-11 text-[11px] font-bold shadow-sm focus-visible:ring-primary px-6 placeholder:font-black placeholder:opacity-20 text-center" 
              placeholder="EJ: MIDJOURNEY, FIREFLY..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRec}
            />
            <p className="mt-4 text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-30">PRESIONA ENTER PARA ENVIAR</p>
          </div>
        </section>
      </main>
    </div>
  );
}
