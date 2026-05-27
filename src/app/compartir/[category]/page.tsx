
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
    <div className="min-h-screen bg-[#F5F5F9] -mx-4 -mt-6 pb-24">
      <div className="container mx-auto py-8 px-6 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-white transition-all active:scale-95">
            <Link href="/compartir">
              <ArrowLeft className="h-5 w-5 text-on-surface" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-on-surface">
            {categoryLabel}
          </h1>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
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
                    "relative rounded-2xl p-3 aspect-[4/5] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 shadow-sm overflow-hidden border-none",
                    isWhiteBg && "shadow-[0_2px_10px_rgb(0,0,0,0.04)]"
                  )}
                  style={{ backgroundColor: service.color || '#4343d5' }}
                >
                  {service.discount && (
                    <div className="absolute top-2 right-2 bg-black/10 backdrop-blur-md w-6 h-6 rounded-full flex items-center justify-center z-10 border border-white/10">
                      <span className={cn("text-[7px] font-bold", brandColor)}>
                        {service.discount}
                      </span>
                    </div>
                  )}

                  <div className="space-y-0.5">
                    <h3 className={cn(
                      "text-[11px] font-bold tracking-tight leading-none pr-4 truncate",
                      brandColor
                    )}>
                      {service.name}
                    </h3>
                    <p className={cn(
                      "text-[8px] font-medium opacity-80",
                      planColor
                    )}>
                      {service.planName || "PREMIUM"}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className={cn(
                      "text-[7px] font-bold uppercase tracking-widest",
                      labelColor
                    )}>
                      COMPARTE
                    </p>
                    <div className="flex items-baseline gap-0.5">
                      <span className={cn(
                        "text-sm font-bold tracking-tight",
                        brandColor
                      )}>
                        RECIBE >
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
