
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
  ia: "Inteligencia Artificial",
  all: "Servicios Premium"
};

export default function CategoryPage({ params: paramsPromise }: { params: Promise<{ category: string }> }) {
  const params = use(paramsPromise);
  const category = params.category as string;

  const services = useMemo(() => {
    if (category === 'all') {
      let all: any[] = [];
      Object.values(servicesByCategory).forEach(list => {
        all = [...all, ...list];
      });
      return all;
    }
    return servicesByCategory[category as CategorySlug] || [];
  }, [category]);

  const categoryName = categoryNames[category] || "Servicios";

  if (services.length === 0 && category !== 'all') {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto pt-12 pb-24 px-4 space-y-4">
      <div className="flex items-center gap-3 mb-2 px-1">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/40 hover:bg-white/60 active:scale-95 transition-all">
          <Link href="/explorar">
            <ArrowLeft className="h-3.5 w-3.5 text-primary" />
          </Link>
        </Button>
        <div className="space-y-0">
          <h1 className="text-base font-extrabold tracking-tight text-on-surface">{categoryName}</h1>
          <p className="text-[7px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em]">Elige una plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {services.map((service) => {
          const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
          const isPerplexity = service.id === 'perplexity';
          const isGemini = service.id === 'gemini';
          
          const brandColor = isPerplexity ? "text-[#1adec5]" : (isGemini ? "text-primary" : (isWhiteBg ? "text-primary" : "text-white"));
          const planColor = isWhiteBg ? "text-on-surface-variant/50" : "text-white/70";
          const labelColor = isWhiteBg ? "text-on-surface-variant/30" : "text-white/40";
          
          return (
            <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
              <div 
                className={cn(
                  "relative rounded-2xl p-2 aspect-square flex flex-col justify-between transition-all duration-500 hover:scale-[1.03] active:scale-95 shadow-sm overflow-hidden border-none",
                  isWhiteBg ? "glass-card" : "shadow-lg shadow-black/5"
                )}
                style={{ backgroundColor: !isWhiteBg ? (service.color || '#4343d5') : undefined }}
              >
                {!isWhiteBg && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}
                
                {service.discount && (
                  <div className="absolute top-1.5 right-1.5 bg-black/10 backdrop-blur-md w-3.5 h-3.5 rounded-full flex items-center justify-center z-10 border border-white/10">
                    <span className={cn("text-[4px] font-black", brandColor)}>
                      {service.discount}
                    </span>
                  </div>
                )}

                <div className="relative z-10 space-y-0.5">
                  <h3 className={cn(
                    "text-[8px] font-extrabold tracking-tight leading-none pr-3 truncate",
                    brandColor
                  )}>
                    {service.name}
                  </h3>
                  <p className={cn(
                    "text-[6px] font-bold opacity-80 uppercase tracking-tighter",
                    planColor
                  )}>
                    {service.planName || "PREMIUM"}
                  </p>
                </div>

                <div className="relative z-10 space-y-0.5">
                  <p className={cn(
                    "text-[5px] font-black uppercase tracking-tighter",
                    labelColor
                  )}>
                    DESDE
                  </p>
                  <span className={cn(
                    "text-[10px] font-extrabold tracking-tight",
                    brandColor
                  )}>
                    S/ {service.pricePerMonth}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {services.length === 0 && (
        <div className="text-center py-20 glass-card rounded-2xl border-dashed border-primary/10">
          <p className="text-[7px] font-black uppercase tracking-widest opacity-20">Próximamente más opciones</p>
        </div>
      )}
    </div>
  );
}
