
'use client';

import { servicesByCategory } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-background -mx-4 -mt-6 pb-24">
      <div className="container mx-auto py-8 px-6 max-w-5xl">
        <div className="flex items-center mb-10">
          <Button asChild variant="ghost" size="icon" className="rounded-full mr-2 hover:bg-white/50">
            <Link href="/compartir">
              <ArrowLeft className="h-6 w-6 text-on-surface" />
            </Link>
          </Button>
          <div className="flex-1 text-left">
            <h1 className="text-2xl font-sora font-black text-on-surface uppercase tracking-tighter">
              {categoryName}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {services.map((service) => {
            const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
            return (
              <Link href={`/publicar?category=${category}&service=${service.id}`} key={service.id} className="block group">
                <div 
                  className={cn(
                    "relative rounded-[2.2rem] p-5 aspect-[4/5] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border",
                    isWhiteBg ? "border-outline-variant/40" : "border-white/10"
                  )}
                  style={{ backgroundColor: service.color || '#4343d5' }}
                >
                  <div className="space-y-1">
                    <h3 className={cn(
                      "font-sora font-black text-2xl uppercase tracking-tighter leading-[0.9]",
                      isWhiteBg ? "text-on-surface" : "text-white"
                    )}>
                      {service.name}
                    </h3>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-wider opacity-70",
                      isWhiteBg ? "text-on-surface-variant" : "text-white"
                    )}>
                      {service.planName || "PREMIUM"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-[0.1em] opacity-80",
                      isWhiteBg ? "text-primary" : "text-white"
                    )}>
                      PUBLICAR
                    </p>
                    <ChevronRight className={cn("h-4 w-4", isWhiteBg ? "text-primary" : "text-white")} />
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
