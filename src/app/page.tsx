
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscriptions, servicesByCategory } from "@/lib/data";
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

  // Filtrar servicios populares (carrusel)
  const filteredPopular = useMemo(() => {
    let allServices: any[] = [];
    Object.values(servicesByCategory).forEach(services => {
      allServices = [...allServices, ...services];
    });

    return allServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
        Object.keys(servicesByCategory).find(key => 
          key === selectedCategory && servicesByCategory[key as CategorySlug].includes(service)
        );
      return matchesSearch && matchesCategory;
    }).slice(0, 6);
  }, [selectedCategory, searchQuery]);

  // Filtrar grupos disponibles
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const matchesSearch = sub.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
        sub.service.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'streaming' && ['netflix', 'disney', 'hbo', 'prime'].some(s => sub.service.toLowerCase().includes(s)));
      return matchesSearch && matchesCategory;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-[1280px] mx-auto pb-32">
        {/* Search & Filter Section */}
        <section className="px-4 pt-6 space-y-4">
          <div className="relative flex items-center group">
            <div className="absolute left-4 flex items-center justify-center pointer-events-none">
              <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">
                search
              </span>
            </div>
            <Input 
              className="w-full pl-12 pr-4 py-6 bg-white border-outline-variant rounded-2xl focus-visible:ring-primary focus-visible:border-primary transition-all text-base placeholder:text-outline/60 shadow-sm" 
              placeholder="Buscar suscripciones o grupos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-2">
            {categories.map((cat) => (
              <Button 
                key={cat.slug}
                variant={selectedCategory === cat.slug ? "default" : "secondary"}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "rounded-full px-6 whitespace-nowrap active:scale-95 transition-transform",
                  selectedCategory === cat.slug ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Featured Carousel (Popular Services) */}
        <section className="mt-8">
          <div className="px-4 flex justify-between items-end mb-4">
            <h2 className="text-2xl font-sora font-bold text-on-surface">Servicios Populares</h2>
            <Button variant="link" className="text-primary font-bold p-0" asChild>
              <Link href="/explorar">Ver todo</Link>
            </Button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 snap-x">
            {filteredPopular.length > 0 ? (
              filteredPopular.map((service) => (
                <Link href={`/explorar/all/${service.id}`} key={service.id} className="min-w-[280px] snap-start">
                  <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-[0_4px_12px_rgba(67,67,213,0.06)] flex flex-col gap-4 hover:shadow-md transition-shadow h-full">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                      style={{ backgroundColor: service.color || '#4343d5' }}
                    >
                      {service.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-sora font-bold text-on-surface">{service.name}</h3>
                      <p className="text-on-surface-variant text-xs font-medium">{service.planName || 'Plan Familiar'}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-primary font-bold text-lg">S/ {service.pricePerMonth || "15.90"}<span className="text-xs font-normal text-outline">/mes</span></span>
                      {service.discount && (
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-200">
                          {service.discount} DCTO
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-10 text-muted-foreground italic">No se encontraron servicios en esta categoría.</div>
            )}
          </div>
        </section>

        {/* Available Groups Grid */}
        <section className="mt-8 px-4">
          <h2 className="text-2xl font-sora font-bold text-on-surface mb-6">Grupos Disponibles</h2>
          {filteredSubscriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubscriptions.map((sub) => (
                <div key={sub.id} className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-[0_4px_12px_rgba(67,67,213,0.06)] hover:shadow-xl transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">play_circle</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-on-surface">{sub.service}</h4>
                        <p className="text-xs text-outline font-medium">Plan Familiar • Mensual</p>
                      </div>
                    </div>
                    <span className="text-2xl font-sora font-bold text-primary">${sub.price.toFixed(2)}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-on-surface-variant">{sub.availableSlots} cupos de {sub.totalSlots}</span>
                        <span className="text-secondary font-black">{Math.round(((sub.totalSlots - sub.availableSlots) / sub.totalSlots) * 100)}% Lleno</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-secondary-fixed transition-all duration-700" 
                          style={{ width: `${((sub.totalSlots - sub.availableSlots) / sub.totalSlots) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative shadow-sm">
                            <Image 
                              src={`https://picsum.photos/seed/member${sub.id}${i}/100/100`} 
                              alt="Miembro" 
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
                          +{sub.totalSlots - 3}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-outline uppercase tracking-tighter">Miembros activos</span>
                    </div>

                    <Button asChild className="w-full py-6 bg-primary text-white rounded-2xl font-sora font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all hover:bg-primary/90">
                      <Link href={`/checkout/${sub.id}`}>Unirse al Grupo</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-3xl">
              <p className="text-muted-foreground">No se encontraron grupos disponibles.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
