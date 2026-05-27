
'use client';

import { servicesByCategory } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Card,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center mb-10">
        <Button asChild variant="ghost" size="icon" className="rounded-full mr-2">
          <Link href="/compartir">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 text-center pr-10">
          <h1 className="text-sm font-bold text-on-surface">Categoría: {categoryName}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const logo = PlaceHolderImages.find((img) => img.id === service.logoId);
          return (
            <Link href={`/publicar?category=${category}&service=${service.id}`} key={service.id}>
              <Card className="flex flex-col h-36 justify-between p-5 transition-all duration-200 hover:shadow-md cursor-pointer border border-outline-variant/30 bg-white rounded-2xl group shadow-sm">
                <div className="flex items-center gap-4">
                  {logo && (
                    <div className="relative w-14 h-14 overflow-hidden rounded-2xl border border-outline-variant/10 shadow-sm shrink-0">
                      <Image
                        src={logo.imageUrl}
                        alt={logo.description}
                        fill
                        className="object-cover"
                        data-ai-hint={logo.imageHint}
                      />
                    </div>
                  )}
                  <CardTitle className="font-sora text-base font-bold text-on-surface">
                    {service.name}
                  </CardTitle>
                </div>
                <div className="flex items-center justify-end text-[11px] text-primary font-black uppercase tracking-tighter group-hover:gap-1.5 transition-all">
                  Publicar <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
