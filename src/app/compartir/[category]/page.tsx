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
    <div className="min-h-screen -mx-4 -mt-6 pb-24">
      <div className="container mx-auto py-8 px-4 max-w-xl">
        <div className="flex items-center gap-3 mb-8">
          <Button asChild variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-white/50 transition-all active:scale-95">
            <Link href="/compartir">
              <ArrowLeft className="h-5 w-5 text-on-surface" />
            </Link>
          </Button>
          <h1 className="text-xl font-sora font-extrabold tracking-tight text-on-surface">
            {categoryLabel}
          </h1>
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
                    "relative rounded-[2rem] p-3 aspect-[4/5] flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:scale-[1.05] active:scale-95 overflow-hidden border-none",
                    isWhiteBg ? "glass-card" : "shadow-lg shadow-black/5"
                  )}
                  style={{ backgroundColor: !isWhiteBg ? (service.color || '#4343d5') : undefined }}
                >
                  {!isWhiteBg && <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />}
                  
                  <div className="relative z-10 space-y-0.5">
                    <h3 className={cn(
                      "text-[11px] font-bold tracking-tight leading-none pr-4",
                      brandColor
                    )}>
                      {service.name}
                    </h3>
                    <p className={cn(
                      "text-[8px] font-medium opacity-80 uppercase tracking-tighter",
                      planColor
                    )}>
                      COMPARTIENDO
                    </p>
                  </div>

                  <div className="relative z-10 space-y-0.5">
                    <p className={cn(
                      "text-[7px] font-black uppercase tracking-widest",
                      labelColor
                    )}>
                      RECIBE
                    </p>
                    <div className="flex items-baseline gap-0.5">
                      <span className={cn(
                        "text-sm font-sora font-extrabold tracking-tight",
                        brandColor
                      )}>
                        S/ {service.hostEarnings}
                      </span>
                    </div>
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