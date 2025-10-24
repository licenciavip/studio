
'use client';

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

export default function CategoryPage({
  params,
}: {
  params: { category: CategorySlug };
}) {
  const { category } = params;
  const services = servicesByCategory[category];
  const categoryName = categoryNames[category];

  if (!services) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1">
          <Button asChild variant="outline">
            <Link href="/explorar">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regresar
            </Link>
          </Button>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Selecciona un servicio
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
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
              <Card className="flex flex-col h-full justify-between p-4 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                <CardHeader className="flex-row items-center gap-4 p-0">
                  {logo && (
                    <Image
                      src={logo.imageUrl}
                      alt={logo.description}
                      width={48}
                      height={48}
                      className="rounded-lg border"
                      data-ai-hint={logo.imageHint}
                    />
                  )}
                  <CardTitle className="font-sans text-lg font-semibold">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <div className="flex items-center justify-end text-sm text-primary font-semibold pt-4">
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
