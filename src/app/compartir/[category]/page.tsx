
'use client';

import { servicesByCategory } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { notFound, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  ia: "IA & Herramientas",
};

export default function CompartirCategoryPage() {
  const params = useParams();
  const category = params.category as string;

  if (!category || !servicesByCategory[category as CategorySlug]) {
    notFound();
  }

  const services = servicesByCategory[category as CategorySlug];
  const categoryLabel = categoryLabels[category] || "SERVICIOS";

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" className="rounded-full h-8 w-8 p-0 bg-white/40 hover:bg-white/60 active:scale-95 transition-all">
            <Link href="/compartir">
              <ArrowLeft className="h-4 w-4 text-on-surface" />
            </Link>
          </Button>
          <div>
            <h1 className="text-base font-sora font-extrabold tracking-tight text-on-surface">
              {categoryLabel}
            </h1>
            <p className="text-[8px] font-bold text-on-surface-variant/30 uppercase tracking-widest">Selecciona plataforma</p>
          </div>
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
              <Link href={`/publicar?category=${category}&service=${service.id}`} key={service.id} className="block group">
                <div 
                  className={cn(
                    "relative rounded-[1.5rem] p-2.5 aspect-[1/1] flex flex-col justify-between transition-all duration-500 hover:scale-[1.03] active:scale-95 overflow-hidden border-none",
                    isWhiteBg ? "glass-card" : "shadow-lg shadow-black/5"
                  )}
                  style={{ backgroundColor: !isWhiteBg ? (service.color || '#4343d5') : undefined }}
                >
                  {!isWhiteBg && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}
                  
                  <div className="relative z-10 space-y-0.5">
                    <h3 className={cn(
                      "text-[9px] font-bold tracking-tight leading-none pr-3 truncate",
                      brandColor
                    )}>
                      {service.name}
                    </h3>
                    <p className={cn(
                      "text-[6px] font-medium opacity-80 uppercase tracking-tighter",
                      planColor
                    )}>
                      VENDIENDO
                    </p>
                  </div>

                  <div className="relative z-10 space-y-0.5">
                    <p className={cn(
                      "text-[6px] font-black uppercase tracking-tighter",
                      labelColor
                    )}>
                      RECIBES
                    </p>
                    <span className={cn(
                      "text-[11px] font-sora font-extrabold tracking-tight",
                      brandColor
                    )}>
                      S/ {service.hostEarnings}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
