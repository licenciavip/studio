
"use client";

import { use, useMemo } from "react";
import { servicesByCategory } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

const categoryNames: Record<string, string> = {
  streaming: "Películas y Series",
  musica: "Música",
  educacion: "Educación",
  gaming: "Gaming",
  diseno: "Diseño",
  seguridad: "VPNs y Seguridad",
  ia: "Inteligencia Artificial",
  deportes: "Deportes",
  bienestar: "Bienestar",
  software: "Software",
  all: "Todos los Servicios"
};

export default function CategoryPage({ params: paramsPromise }: { params: Promise<{ category: string }> }) {
  const params = use(paramsPromise);
  const category = params.category as string;

  const services = useMemo(() => {
    if (category === 'all') {
      let all: any[] = [];
      Object.values(servicesByCategory).forEach(list => all = [...all, ...list]);
      return all;
    }
    return servicesByCategory[category as CategorySlug] || [];
  }, [category]);

  const categoryName = categoryNames[category] || "Servicios";

  if (services.length === 0 && category !== 'all') {
    notFound();
  }

  // Diseño de cuadrícula de colores para la categoría de streaming o "all"
  const isGridStyle = category === 'streaming' || category === 'all';

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <Button asChild variant="ghost" className="rounded-full h-12 w-12 p-0">
            <Link href="/">
              <ArrowLeft className="h-6 w-6 text-on-surface" />
            </Link>
          </Button>
        </div>
        <div className="flex-[4] text-left">
          <h1 className="text-2xl font-sora font-bold tracking-tight text-on-surface">
            {categoryName}
          </h1>
        </div>
      </div>

      <div className={cn(
        "grid gap-4",
        isGridStyle ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}>
        {services.map((service) => (
          <Link href={`/explorar/${category}/${service.id}`} key={service.id} className="block group">
            <div 
              className={cn(
                "relative rounded-2xl p-4 aspect-square flex flex-col justify-between transition-transform active:scale-95 shadow-sm overflow-hidden",
                !isGridStyle ? "bg-surface-container-lowest border border-outline-variant/30" : "border border-white/10"
              )}
              style={isGridStyle && service.color ? { backgroundColor: service.color } : { backgroundColor: '#4343d5' }}
            >
              {service.discount && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white/20">
                  {service.discount}
                </div>
              )}

              <div className="space-y-1">
                <h3 className="font-sora font-black text-lg uppercase tracking-tighter leading-none text-white">
                  {service.name}
                </h3>
                <p className="text-[10px] font-medium opacity-80 text-white">
                  {service.planName || service.name}
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="text-[10px] font-medium opacity-60 text-white">
                  Planes desde
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-sora font-bold text-white">
                    S/ {service.pricePerMonth || "15.90"}
                  </span>
                  <span className="text-[10px] font-medium opacity-50 text-white">
                    /mes
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
