
'use client';

import { servicesByCategory } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { notFound, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const categoryNames: Record<string, string> = {
  ia: "Inteligencia Artificial",
};

export default function CompartirCategoryPage() {
  const params = useParams();
  const category = params.category as string;

  if (!category || !servicesByCategory[category as CategorySlug]) {
    notFound();
  }

  const services = servicesByCategory[category as CategorySlug];
  const categoryName = categoryNames[category] || "Servicios";

  return (
    <div className="min-h-screen bg-[#F5F5F9] -mx-4 -mt-6 pb-24">
      <div className="container mx-auto py-8 px-6 max-w-5xl">
        <div className="flex items-center mb-10">
          <Button asChild variant="ghost" size="icon" className="rounded-full mr-2 hover:bg-white">
            <Link href="/compartir">
              <ArrowLeft className="h-6 w-6 text-on-surface" />
            </Link>
          </Button>
          <div className="flex-1 text-left">
            <h1 className="text-[10px] font-bold tracking-[0.3em] text-on-surface-variant/40 uppercase">
              {categoryName}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {services.map((service) => {
            const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
            const textColorClass = isWhiteBg ? "text-[#000839]" : "text-white";
            
            return (
              <Link href={`/publicar?category=${category}&service=${service.id}`} key={service.id} className="block group">
                <div 
                  className={cn(
                    "relative rounded-[2.8rem] p-7 aspect-[4/5] flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-lg overflow-hidden",
                    isWhiteBg && "shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                  )}
                  style={{ backgroundColor: service.color || '#4343d5' }}
                >
                  {/* Top part: Name and Plan */}
                  <div className="space-y-0.5">
                    <h3 className={cn(
                      "font-sora font-black text-[1.6rem] uppercase tracking-tighter leading-[1]",
                      textColorClass
                    )}>
                      {service.name}
                    </h3>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-tight opacity-70",
                      textColorClass
                    )}>
                      {service.planName || "PREMIUM"}
                    </p>
                  </div>

                  {/* Bottom part: Receive action */}
                  <div className="space-y-0.5">
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-widest opacity-60",
                      textColorClass
                    )}>
                      PUBLICAR
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "text-[1.35rem] font-sora font-black tracking-tighter",
                        textColorClass
                      )}>
                        RECIBE &gt;
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
