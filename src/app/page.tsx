
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { servicesByCategory } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
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
        {/* Búsqueda y Filtros */}
        <section className="px-4 pt-4 space-y-3">
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
          
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
            {categories.map((cat) => (
              <Button 
                key={cat.slug}
                variant={selectedCategory === cat.slug ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "rounded-full px-3 whitespace-nowrap active:scale-95 transition-transform h-7 text-[11px] font-bold",
                  selectedCategory === cat.slug ? "bg-primary text-white" : "bg-surface-container/60 text-on-surface-variant"
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Galería de Servicios Agrupados */}
        <section className="mt-6 px-4 space-y-8">
          {hasResults ? (
            Object.entries(groupedServices).map(([slug, services]) => (
              <div key={slug} className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-sm font-sora font-black uppercase tracking-tight text-on-surface">
                    {categoryLabels[slug] || slug}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {services.map((service) => (
                    <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                      <div 
                        className={cn(
                          "relative rounded-xl p-3 aspect-square flex flex-col justify-between transition-transform active:scale-95 shadow-sm overflow-hidden border",
                          service.color === "#ffffff" ? "border-outline-variant/30" : "border-white/10"
                        )}
                        style={{ backgroundColor: service.color || '#4343d5' }}
                      >
                        {service.discount && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg border border-white/20">
                            {service.discount}
                          </div>
                        )}

                        <div className="space-y-0.5">
                          <h3 className={cn(
                            "font-sora font-black text-sm uppercase tracking-tighter leading-none truncate",
                            service.color === "#ffffff" || service.color === "#ffea00" || service.color === "#ffcc00" ? "text-on-surface" : "text-white"
                          )}>
                            {service.name}
                          </h3>
                          <p className={cn(
                            "text-[9px] font-medium opacity-80 truncate",
                            service.color === "#ffffff" || service.color === "#ffea00" || service.color === "#ffcc00" ? "text-on-surface-variant" : "text-white"
                          )}>
                            {service.planName || service.name}
                          </p>
                        </div>

                        <div className="space-y-0.5">
                          <p className={cn(
                            "text-[8px] font-medium opacity-60",
                            service.color === "#ffffff" || service.color === "#ffea00" || service.color === "#ffcc00" ? "text-on-surface-variant" : "text-white"
                          )}>
                            Desde
                          </p>
                          <div className="flex items-baseline gap-0.5">
                            <span className={cn(
                              "text-base font-sora font-bold",
                              service.color === "#ffffff" || service.color === "#ffea00" || service.color === "#ffcc00" ? "text-on-surface" : "text-white"
                            )}>
                              S/ {service.pricePerMonth || "15.90"}
                            </span>
                            <span className={cn(
                              "text-[8px] font-medium opacity-50",
                              service.color === "#ffffff" || service.color === "#ffea00" || service.color === "#ffcc00" ? "text-on-surface-variant" : "text-white"
                            )}>
                              /mes
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground text-xs italic border border-dashed rounded-xl">
              No se encontraron servicios de IA que coincidan con tu búsqueda.
            </div>
          )}
        </section>

        {/* Sección de Recomendaciones */}
        <section className="mt-16 px-4 py-12 text-center space-y-6 bg-surface-container/30 rounded-[2rem] mx-4 border border-outline-variant/10">
          <div className="space-y-2">
            <h2 className="text-xl font-sora font-black text-on-surface leading-tight">
              ¿Buscas otra IA?
            </h2>
            <p className="text-xs text-on-surface-variant font-medium max-w-[240px] mx-auto">
              Cuéntanos qué herramienta necesitas y la conseguiremos para ti.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <Input 
              className="w-full bg-white border-outline-variant rounded-2xl h-11 text-xs shadow-sm focus-visible:ring-primary px-5" 
              placeholder="Ej: Midjourney, Adobe Firefly..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              onKeyDown={handleRecommendSubmit}
              disabled={isSubmittingRec}
            />
            <p className="mt-3 text-[10px] text-muted-foreground font-medium italic">Presiona Enter para enviar</p>
          </div>
        </section>
      </main>
    </div>
  );
}
