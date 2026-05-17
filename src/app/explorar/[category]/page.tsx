
'use client';

import { use } from "react";
import { servicesByCategory } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categoryNames: Record<CategorySlug, string> = {
  streaming: "Películas y Series",
  musica: "Música",
  educacion: "Educación",
  gaming: "Gaming",
  diseno: "Diseño",
  seguridad: "VPNs y Seguridad",
  ia: "Inteligencia Artificial",
  deportes: "Deportes",
  bienestar: "Bienestar",
  software: "Software",
};

export default function CategoryPage({ params: paramsPromise }: { params: Promise<{ category: string }> }) {
  const params = use(paramsPromise);
  const category = params.category as CategorySlug;

  const services = servicesByCategory[category];
  const categoryName = categoryNames[category];

  if (!services) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regresar
            </Link>
          </Button>
        </div>
        <div className="flex-[2] text-center">
          <h1 className="text-3xl font-sora font-bold tracking-tight text-on-surface">
            Selecciona un servicio
          </h1>
          <p className="mt-2 text-on-surface-variant font-medium">
            Categoría: {categoryName}
          </p>
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const logo = PlaceHolderImages.find((img) => img.id === service.logoId);
          return (
            <Link href={`/explorar/${category}/${service.id}`} key={service.id}>
              <Card className="flex flex-col h-full justify-between p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer border-outline-variant/30 shadow-sm bg-surface-container-lowest rounded-3xl group">
                <CardHeader className="flex-row items-center gap-4 p-0">
                  {logo && (
                    <div className="relative w-14 h-14 overflow-hidden rounded-2xl border border-outline-variant/20 bg-white">
                      <Image
                        src={logo.imageUrl}
                        alt={logo.description}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                        data-ai-hint={logo.imageHint}
                      />
                    </div>
                  )}
                  <CardTitle className="font-sora text-lg font-bold text-on-surface">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <div className="flex items-center justify-end text-sm text-primary font-bold pt-6 group-hover:underline">
                  Ver grupos <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
