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
      <div className="container mx-auto py-8 px-4 max-w-5xl">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {services.map((service) => {
            return (
              <Link href={`/publicar?category=${category}&service=${service.id}`} key={service.id} className="block group">
                <div 
                  className="relative rounded-2xl p-4 aspect-[4/3] flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 bg-white border border-outline-variant/30 overflow-hidden shadow-sm"
                >
                  <div className="flex justify-between items-start w-full">
                    <h3 className="text-[12px] font-bold tracking-tight text-on-surface leading-tight pr-1 line-clamp-2">
                      {service.name}
                    </h3>
                    <div className="bg-amber-100/60 px-2 py-0.5 rounded-full border border-amber-200/50 shrink-0">
                      <span className="text-[7px] font-bold text-amber-700/80 uppercase">
                        Compartiendo
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5 mt-2">
                    <p className="text-[9px] font-medium text-on-surface-variant/50">
                      Recibe hasta
                    </p>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-bold text-secondary tracking-tight">
                        S/ {service.hostEarnings}
                      </span>
                      <span className="text-[8px] font-medium text-on-surface-variant/40">
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
    </div>
  );
}
