"use client";

import { use } from "react";
import { servicesByCategory } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

const categoryNames: Record<CategorySlug, string> = {
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
};

export default function CategoryPage({ params: paramsPromise }: { params: Promise<{ category: string }> }) {
  const params = use(paramsPromise);
  const category = params.category as CategorySlug;

  const services = servicesByCategory[category];
  const categoryName = categoryNames[category];

  if (!services) {
    notFound();
  }

  // Diseño de cuadrícula de colores para la categoría de streaming
  const isStreaming = category === 'streaming';

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
        isStreaming ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}>
        {services.map((service) => (
          <Link href={`/explorar/${category}/${service.id}`} key={service.id} className="block group">
            <div 
              className={cn(
                "relative rounded-2xl p-4 aspect-square flex flex-col justify-between transition-transform active:scale-95 shadow-sm overflow-hidden",
                !isStreaming ? "bg-surface-container-lowest border border-outline-variant/30" : "border border-white/10"
              )}
              style={isStreaming ? { backgroundColor: service.color } : {}}
            >
              {/* Descuento visible en streaming */}
              {isStreaming && service.discount && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white/20">
                  {service.discount}
                </div>
              )}

              <div className="space-y-1">
                <h3 className={cn(
                  "font-sora font-black text-lg uppercase tracking-tighter leading-none",
                  isStreaming ? "text-white" : "text-on-surface"
                )}>
                  {service.name}
                </h3>
                <p className={cn(
                  "text-[10px] font-medium opacity-80",
                  isStreaming ? "text-white" : "text-on-surface-variant"
                )}>
                  {service.planName || service.name}
                </p>
              </div>

              <div className="space-y-0.5">
                <p className={cn(
                  "text-[10px] font-medium opacity-60",
                  isStreaming ? "text-white" : "text-on-surface-variant"
                )}>
                  Planes desde
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "text-xl font-sora font-bold",
                    isStreaming ? "text-white" : "text-primary"
                  )}>
                    S/ {service.pricePerMonth || "0.00"}
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium opacity-50",
                    isStreaming ? "text-white" : "text-on-surface-variant"
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
  );
}
