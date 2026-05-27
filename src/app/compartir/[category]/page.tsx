
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
  CardHeader,
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
      <div className="flex items-center mb-8">
        <Button asChild variant="ghost" size="icon" className="rounded-full mr-2">
          <Link href="/compartir">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 text-center pr-10">
          <p className="text-sm font-medium text-muted-foreground">Categoría: {categoryName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => {
          const logo = PlaceHolderImages.find((img) => img.id === service.logoId);
          return (
            <Link href={`/publicar?category=${category}&service=${service.id}`} key={service.id}>
              <Card className="flex flex-col h-32 justify-between p-4 transition-all duration-200 hover:shadow-md cursor-pointer border border-outline-variant/30 bg-white rounded-2xl group">
                <div className="flex items-center gap-3">
                  {logo && (
                    <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-outline-variant/10 shadow-sm shrink-0">
                      <Image
                        src={logo.imageUrl}
                        alt={logo.description}
                        fill
                        className="object-cover"
                        data-ai-hint={logo.imageHint}
                      />
                    </div>
                  )}
                  <CardTitle className="font-sora text-sm font-bold truncate">
                    {service.name}
                  </CardTitle>
                </div>
                <div className="flex items-center justify-end text-[10px] text-primary font-black uppercase tracking-tighter group-hover:gap-1.5 transition-all">
                  Publicar <ChevronRight className="h-3 w-3 ml-0.5" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
