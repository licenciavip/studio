
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
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-10">
        <Button asChild variant="ghost" className="rounded-full h-12 w-12 p-0 hover:bg-surface-container">
          <Link href="/">
            <ArrowLeft className="h-6 w-6 text-on-surface" />
          </Link>
        </Button>
        <h1 className="text-2xl font-sora font-black tracking-tighter text-on-surface uppercase">
          {categoryName}
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {services.map((service) => {
          const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
          return (
            <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
              <div 
                className={cn(
                  "relative rounded-[2.2rem] p-5 aspect-[4/5] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border",
                  isWhiteBg ? "border-outline-variant/40" : "border-white/10"
                )}
                style={{ backgroundColor: service.color || '#4343d5' }}
              >
                <div className="space-y-1">
                  <h3 className={cn(
                    "font-sora font-black text-xl uppercase tracking-tighter leading-[0.9]",
                    isWhiteBg ? "text-on-surface" : "text-white"
                  )}>
                    {service.name}
                  </h3>
                  <p className={cn(
                    "text-[8px] font-black uppercase tracking-wider opacity-70",
                    isWhiteBg ? "text-on-surface-variant" : "text-white"
                  )}>
                    {service.planName || "PREMIUM"}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className={cn(
                    "text-[8px] font-black uppercase tracking-[0.1em] opacity-60",
                    isWhiteBg ? "text-on-surface-variant" : "text-white"
                  )}>
                    DESDE
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "text-[1.25rem] font-sora font-black tracking-tighter",
                      isWhiteBg ? "text-on-surface" : "text-white"
                    )}>
                      S/ {service.pricePerMonth || "15.90"}
                    </span>
                    <span className={cn(
                      "text-[8px] font-black opacity-40",
                      isWhiteBg ? "text-on-surface-variant" : "text-white"
                    )}>
                      /MES
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
