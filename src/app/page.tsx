
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { servicesByCategory } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/lib/types";

const categories = [
  { label: "Todo", slug: "all" },
  { label: "Streaming", slug: "streaming" },
  { label: "Música", slug: "musica" },
  { label: "Software", slug: "software" },
  { label: "Gaming", slug: "gaming" },
  { label: "Educación", slug: "educacion" },
  { label: "IA", slug: "ia" }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = useMemo(() => {
    let all: any[] = [];
    if (selectedCategory === "all") {
      Object.values(servicesByCategory).forEach(list => all = [...all, ...list]);
    } else {
      all = servicesByCategory[selectedCategory as CategorySlug] || [];
    }

    return all.filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-[1280px] mx-auto pb-24">
        {/* Búsqueda y Filtros Compactos */}
        <section className="px-4 pt-4 space-y-3">
          <div className="relative flex items-center group">
            <div className="absolute left-4 flex items-center justify-center pointer-events-none">
              <span className="material-symbols-outlined text-outline/70 group-focus-within:text-primary transition-colors text-lg">
                search
              </span>
            </div>
            <Input 
              className="w-full pl-10 pr-4 py-3 bg-white border-outline-variant/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary transition-all text-xs placeholder:text-outline/50 shadow-sm h-10" 
              placeholder="¿Qué servicio buscas hoy?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
            {categories.map((cat) => (
              <Button 
                key={cat.slug}
                variant={selectedCategory === cat.slug ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "rounded-full px-3 whitespace-nowrap active:scale-95 transition-transform h-7 text-[11px] font-bold",
                  selectedCategory === cat.slug ? "bg-primary text-white" : "bg-surface-container/60 text-on-surface-variant"
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Cuadrícula de Servicios (Estilo Kotango pero más pequeño) */}
        <section className="mt-6 px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-sora font-bold text-on-surface">Servicios Disponibles</h2>
            <p className="text-[10px] text-muted-foreground font-medium">{filteredServices.length} resultados</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredServices.map((service) => (
              <Link href={`/explorar/all/${service.id}`} key={service.id} className="block group">
                <div 
                  className="relative rounded-xl p-3 aspect-square flex flex-col justify-between transition-transform active:scale-95 shadow-sm overflow-hidden border border-white/10"
                  style={{ backgroundColor: service.color || '#4343d5' }}
                >
                  {service.discount && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg border border-white/20">
                      {service.discount}
                    </div>
                  )}

                  <div className="space-y-0.5">
                    <h3 className="font-sora font-black text-sm uppercase tracking-tighter leading-none text-white truncate">
                      {service.name}
                    </h3>
                    <p className="text-[9px] font-medium opacity-80 text-white truncate">
                      {service.planName || service.name}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-[8px] font-medium opacity-60 text-white">
                      Desde
                    </p>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base font-sora font-bold text-white">
                        S/ {service.pricePerMonth || "15.90"}
                      </span>
                      <span className="text-[8px] font-medium opacity-50 text-white">
                        /mes
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {filteredServices.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground text-xs italic border border-dashed rounded-xl">
                No se encontraron servicios en esta categoría.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
