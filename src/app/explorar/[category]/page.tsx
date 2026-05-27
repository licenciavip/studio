
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
  ia: "INTELIGENCIA ARTIFICIAL",
  all: "TODOS LOS SERVICIOS"
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

  const categoryName = categoryNames[category] || "SERVICIOS";

  if (services.length === 0 && category !== 'all') {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-[#F5F5F9] min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <Button asChild variant="ghost" className="rounded-full h-12 w-12 p-0 hover:bg-white transition-all active:scale-95">
          <Link href="/">
            <ArrowLeft className="h-6 w-6 text-on-surface" />
          </Link>
        </Button>
        <h1 className="text-[9px] font-normal uppercase tracking-[0.3em] text-on-surface-variant/40 font-sans">
          {categoryName}
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {services.map((service) => {
          const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
          const isPerplexity = service.id === 'perplexity';
          const textColor = isWhiteBg ? "text-on-surface" : "text-white";
          const brandColor = isPerplexity ? "text-[#1adec5]" : (isWhiteBg ? "text-primary" : "text-white");
          const planColor = isWhiteBg ? "text-on-surface-variant" : "text-white/80";
          
          return (
            <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
              <div 
                className={cn(
                  "relative rounded-[2rem] p-5 aspect-[4/5] flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-lg overflow-hidden border-none",
                  isWhiteBg && "shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                )}
                style={{ backgroundColor: service.color || '#4343d5' }}
              >
                {service.discount && (
                  <div className="absolute top-3 right-3 bg-black/10 backdrop-blur-md px-2 py-0.5 rounded-full">
                    <span className={cn(
                      "text-[9px] font-bold",
                      isPerplexity ? "text-[#1adec5]" : "text-white"
                    )}>
                      {service.discount}
                    </span>
                  </div>
                )}

                <div className="space-y-0.5">
                  <h3 className={cn(
                    "text-xl font-bold tracking-tight leading-none",
                    brandColor
                  )}>
                    {service.name}
                  </h3>
                  <p className={cn(
                    "text-[10px] font-medium opacity-80",
                    planColor
                  )}>
                    {service.planName || "PREMIUM"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className={cn(
                    "text-[8px] font-medium opacity-60 uppercase tracking-wider",
                    textColor
                  )}>
                    Planes desde
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className={cn(
                      "text-xl font-bold tracking-tight",
                      brandColor
                    )}>
                      S/ {service.pricePerMonth}
                    </span>
                    <span className={cn(
                      "text-[10px] font-medium opacity-40",
                      textColor
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
  );
}
