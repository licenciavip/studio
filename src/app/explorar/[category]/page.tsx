
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

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 bg-[#F5F5F9] min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" className="rounded-full h-10 w-10 p-0 hover:bg-white transition-all active:scale-95">
          <Link href="/">
            <ArrowLeft className="h-5 w-5 text-on-surface" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight text-on-surface">
          {categoryName}
        </h1>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {services.map((service) => {
          const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
          const isPerplexity = service.id === 'perplexity';
          const isGemini = service.id === 'gemini';
          
          const brandColor = isPerplexity ? "text-[#1adec5]" : (isGemini ? "text-primary" : "text-white");
          const textColor = isWhiteBg ? "text-on-surface" : "text-white";
          const planColor = isWhiteBg ? "text-on-surface-variant/80" : "text-white/80";
          const labelColor = isWhiteBg ? "text-on-surface-variant/60" : "text-white/60";
          
          return (
            <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
              <div 
                className={cn(
                  "relative rounded-2xl p-3 aspect-[4/5] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 shadow-sm overflow-hidden border-none",
                  isWhiteBg && "shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
                )}
                style={{ backgroundColor: service.color || '#4343d5' }}
              >
                {service.discount && (
                  <div className="absolute top-2 right-2 bg-black/10 backdrop-blur-md w-6 h-6 rounded-full flex items-center justify-center z-10">
                    <span className={cn(
                      "text-[7px] font-bold",
                      isPerplexity ? "text-[#1adec5]" : (isWhiteBg ? "text-primary" : "text-white")
                    )}>
                      {service.discount}
                    </span>
                  </div>
                )}

                <div className="space-y-0.5">
                  <h3 className={cn(
                    "text-[11px] font-bold tracking-tight leading-none truncate pr-3",
                    brandColor
                  )}>
                    {service.name}
                  </h3>
                  <p className={cn(
                    "text-[8px] font-medium",
                    planColor
                  )}>
                    {service.planName || "PREMIUM"}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className={cn(
                    "text-[7px] font-medium uppercase tracking-wider",
                    labelColor
                  )}>
                    DESDE
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className={cn(
                      "text-sm font-bold tracking-tight",
                      brandColor
                    )}>
                      S/ {service.pricePerMonth}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
