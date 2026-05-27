
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
        <Button asChild variant="ghost" className="rounded-full h-12 w-12 p-0 hover:bg-white">
          <Link href="/">
            <ArrowLeft className="h-6 w-6 text-on-surface" />
          </Link>
        </Button>
        <h1 className="text-[9px] font-normal uppercase tracking-[0.3em] text-on-surface-variant/40 font-inter">
          {categoryName}
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {services.map((service) => {
          const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
          const textColor = isWhiteBg ? "text-[#000839]" : "text-white";
          
          return (
            <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
              <div 
                className={cn(
                  "relative rounded-[2rem] p-5 aspect-square flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-lg overflow-hidden border-none",
                  isWhiteBg && "shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                )}
                style={{ backgroundColor: service.color || '#4343d5' }}
              >
                <div className="space-y-0.5">
                  <h3 className={cn(
                    "font-sans font-black text-[1.1rem] uppercase tracking-tighter leading-none",
                    textColor
                  )}>
                    {service.name}
                  </h3>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-tighter opacity-70",
                    textColor
                  )}>
                    {service.planName || "PREMIUM"}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-widest opacity-60",
                    textColor
                  )}>
                    DESDE
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className={cn(
                      "text-[1.1rem] font-sans font-black tracking-tighter leading-none",
                      textColor
                    )}>
                      S/{service.pricePerMonth || "15.90"}
                    </span>
                    <span className={cn(
                      "text-[10px] font-black uppercase opacity-40 ml-0.5",
                      textColor
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
