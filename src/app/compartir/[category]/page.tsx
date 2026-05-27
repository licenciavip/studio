
'use client';

import { servicesByCategory } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card } from "@/components/ui/card";

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
    <div className="min-h-screen bg-[#f8f9ff] -mx-4 -mt-6 pb-24">
      <div className="container mx-auto py-8 px-6 max-w-5xl">
        <div className="flex items-center mb-10">
          <Button asChild variant="ghost" size="icon" className="rounded-full mr-2 hover:bg-white/50">
            <Link href="/compartir">
              <ArrowLeft className="h-6 w-6 text-on-surface" />
            </Link>
          </Button>
          <div className="flex-1 text-center pr-10">
            <h1 className="text-[10px] font-black text-on-surface uppercase tracking-[0.2em] opacity-40">
              {categoryName}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const logo = PlaceHolderImages.find((img) => img.id === service.logoId);
            return (
              <Link href={`/publicar?category=${category}&service=${service.id}`} key={service.id}>
                <Card className="relative flex items-center h-40 p-6 bg-white rounded-[3.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_15px_45px_rgb(0,0,0,0.08)] hover:-translate-y-1 group cursor-pointer overflow-hidden">
                  <div className="flex items-center gap-6 w-full">
                    {logo && (
                      <div className="relative w-20 h-20 overflow-hidden rounded-[1.8rem] shadow-sm shrink-0 border border-outline-variant/10">
                        <Image
                          src={logo.imageUrl}
                          alt={logo.description}
                          fill
                          className="object-cover"
                          data-ai-hint={logo.imageHint}
                        />
                      </div>
                    )}
                    <h2 className="font-sora text-2xl font-black text-[#131b2e] tracking-tighter">
                      {service.name}
                    </h2>
                  </div>
                  
                  <div className="absolute bottom-6 right-10 flex items-center text-[10px] font-black text-primary tracking-[0.2em] uppercase transition-all group-hover:gap-1">
                    Publicar <ChevronRight className="h-3 w-3 ml-0.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
