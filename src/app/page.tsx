
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
import { ChevronRight, Plus, Info } from "lucide-react";
import type { CategorySlug, Service } from "@/lib/types";

const categories = [
  { label: "Todo", slug: "all" },
  { label: "IA", slug: "ia" },
];

const categoryLabels: Record<string, string> = {
  ia: "Inteligencia Artificial",
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
          <h2 className="text-sm font-sora font-bold text-on-surface">Novedades</h2>
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm transition-transform active:scale-[0.98]">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                   <Image src="https://picsum.photos/seed/novedades/100/100" alt="Lank Mundial" width={32} height={32} className="rounded-md" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface leading-tight">Lank Mundial 2026</h3>
                  <p className="text-[10px] text-on-surface-variant">Prode, resultados, trivia y más</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-outline-variant" />
            </div>
            <div className="bg-[#ff4d00] py-1.5 px-4">
              <p className="text-[9px] font-black text-white uppercase tracking-wider">El mejor lugar para vivir el mundial</p>
            </div>
          </div>
        </section>

        {/* Mis Grupos Section */}
        <section className="mt-6 px-4 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-sora font-bold text-on-surface">Mis grupos</h2>
            <Link href="/mis-grupos" className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors uppercase">Ver más</Link>
          </div>
          <div className="space-y-2">
            {groups.slice(0, 1).map((group) => (
              <Link href={`/mis-grupos/${group.id}`} key={group.id} className="block">
                <div className="p-4 flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-white shadow-sm active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <Image src={`https://picsum.photos/seed/${group.id}/100/100`} alt={group.service} width={24} height={24} className="object-contain" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface leading-tight">{group.service}</h3>
                      <p className="text-[10px] text-on-surface-variant">{group.slots.filled} cupos compartidos</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-outline-variant" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mis Suscripciones Section */}
        <section className="mt-6 px-4 space-y-3">
          <h2 className="text-sm font-sora font-bold text-on-surface">Mis suscripciones</h2>
          <Link href="/mis-ordenes" className="block">
            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between group active:scale-[0.98] transition-transform">
              <div>
                <h3 className="text-sm font-bold text-primary leading-tight">Todavía no tienes suscripciones activas</h3>
                <p className="text-[10px] text-primary/70">¡Únete a un grupo y ahorra hasta 50%!</p>
              </div>
              <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </section>

        {/* Galería de Servicios Agrupados */}
        <section className="mt-8 px-4 space-y-8">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <Button 
                key={cat.slug}
                variant={selectedCategory === cat.slug ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "rounded-full px-3 whitespace-nowrap active:scale-95 transition-transform h-7 text-[11px] font-bold shadow-sm",
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
                  <h2 className="text-xs font-sora font-black uppercase tracking-widest text-on-surface-variant">
                    {categoryLabels[slug] || slug}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {services.map((service) => {
                    const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
                    return (
                      <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                        <div 
                          className={cn(
                            "relative rounded-3xl p-4 aspect-square flex flex-col justify-between transition-transform active:scale-95 shadow-sm overflow-hidden border",
                            isWhiteBg ? "border-outline-variant/30" : "border-white/10"
                          )}
                          style={{ backgroundColor: service.color || '#4343d5' }}
                        >
                          {service.discount && (
                            <div className="absolute top-3 right-3 bg-[#10a37f] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg border border-white/20">
                              {service.discount}
                            </div>
                          )}

                          <div className="space-y-0.5">
                            <h3 className={cn(
                              "font-sora font-black text-lg uppercase tracking-tighter leading-none truncate",
                              isWhiteBg ? "text-on-surface" : "text-white"
                            )}>
                              {service.name}
                            </h3>
                            <p className={cn(
                              "text-[10px] font-medium opacity-80 truncate",
                              isWhiteBg ? "text-on-surface-variant" : "text-white"
                            )}>
                              {service.planName || service.name}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <p className={cn(
                              "text-[10px] font-medium opacity-70",
                              isWhiteBg ? "text-on-surface-variant" : "text-white"
                            )}>
                              Desde
                            </p>
                            <div className="flex items-baseline gap-0.5">
                              <span className={cn(
                                "text-lg font-sora font-black",
                                isWhiteBg ? "text-on-surface" : "text-white"
                              )}>
                                S/ {service.pricePerMonth || "15.90"}
                              </span>
                              <span className={cn(
                                "text-[10px] font-medium opacity-50",
                                isWhiteBg ? "text-on-surface-variant" : "text-white"
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
            <div className="py-12 text-center text-muted-foreground text-[10px] italic border border-dashed rounded-xl border-outline-variant/50">
              No se encontraron servicios de IA que coincidan con tu búsqueda.
            </div>
          )}
        </section>

        {/* Sección de Recomendaciones */}
        <section className="mt-16 px-4 py-8 text-center space-y-4 bg-surface-container/30 rounded-[2rem] mx-4 border border-outline-variant/10">
          <div className="space-y-1">
            <h2 className="text-lg font-sora font-black text-on-surface leading-tight">
              ¿Buscas otra IA?
            </h2>
            <p className="text-[10px] text-on-surface-variant font-medium max-w-[200px] mx-auto">
              Cuéntanos qué herramienta necesitas y la conseguiremos para ti.
            </p>
          </div>
          <div className="max-w-xs mx-auto">
            <Input 
              className="w-full bg-white border-outline-variant rounded-2xl h-10 text-[10px] shadow-sm focus-visible:ring-primary px-5" 
              placeholder="Ej: Midjourney, Adobe Firefly..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRec}
            />
            <p className="mt-2 text-[9px] text-muted-foreground font-medium italic">Presiona Enter para enviar</p>
          </div>
        </section>
      </main>
    </div>
  );
}
