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
    }).slice(0, 8);
  }, [selectedCategory, searchQuery]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const matchesSearch = sub.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || 
        sub.service.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'streaming' && ['netflix', 'disney', 'hbo', 'prime', 'youtube'].some(s => sub.service.toLowerCase().includes(s)));
      return matchesSearch && matchesCategory;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow w-full max-w-[1280px] mx-auto pb-24">
        {/* Search & Filter Section */}
        <section className="px-4 pt-4 space-y-3">
          <div className="relative flex items-center group">
            <div className="absolute left-4 flex items-center justify-center pointer-events-none">
              <span className="material-symbols-outlined text-outline/70 group-focus-within:text-primary transition-colors text-lg">
                search
              </span>
            </div>
            <Input 
              className="w-full pl-10 pr-4 py-4 bg-white border-outline-variant/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary transition-all text-sm placeholder:text-outline/50 shadow-sm h-11" 
              placeholder="Buscar servicios o grupos..." 
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
                  "rounded-full px-4 whitespace-nowrap active:scale-95 transition-transform h-8 text-xs font-semibold",
                  selectedCategory === cat.slug ? "bg-primary text-white" : "bg-surface-container/60 text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </section>

        {/* Featured Carousel (Popular Services) */}
        <section className="mt-6">
          <div className="px-4 flex justify-between items-end mb-3">
            <h2 className="text-lg font-sora font-bold text-on-surface">Servicios Populares</h2>
            <Button variant="link" className="text-primary font-bold p-0 h-auto text-xs" asChild>
              <Link href="/explorar/all">Ver todo</Link>
            </Button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2 snap-x">
            {filteredPopular.length > 0 ? (
              filteredPopular.map((service) => (
                <Link href={`/explorar/all/${service.id}`} key={service.id} className="min-w-[200px] snap-start">
                  <div className="bg-white border border-outline-variant/20 rounded-2xl p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow h-full">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                      style={{ backgroundColor: service.color || '#4343d5' }}
                    >
                      {service.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-sora font-bold text-on-surface truncate">{service.name}</h3>
                      <p className="text-on-surface-variant text-[10px] font-medium">{service.planName || 'Plan Familiar'}</p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-primary font-bold text-sm">S/ {service.pricePerMonth || "15.90"}<span className="text-[10px] font-normal text-outline">/mes</span></span>
                      {service.discount && (
                        <div className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded-md text-[9px] font-black border border-green-100">
                          {service.discount}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-6 text-muted-foreground italic text-sm">No se encontraron servicios.</div>
            )}
          </div>
        </section>

        {/* Available Groups Grid */}
        <section className="mt-6 px-4">
          <h2 className="text-lg font-sora font-bold text-on-surface mb-4">Grupos Disponibles</h2>
          {filteredSubscriptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubscriptions.map((sub) => (
                <div key={sub.id} className="bg-white border border-outline-variant/20 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl">play_circle</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">{sub.service}</h4>
                        <p className="text-[10px] text-outline font-medium">Plan Familiar • Mensual</p>
                      </div>
                    </div>
                    <span className="text-lg font-sora font-bold text-primary">${sub.price.toFixed(2)}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-on-surface-variant">{sub.availableSlots} cupos de {sub.totalSlots}</span>
                        <span className="text-secondary font-black">{Math.round(((sub.totalSlots - sub.availableSlots) / sub.totalSlots) * 100)}% Lleno</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-secondary transition-all duration-700" 
                          style={{ width: `${((sub.totalSlots - sub.availableSlots) / sub.totalSlots) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <div className="flex -space-x-1.5">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden relative shadow-sm">
                            <Image 
                              src={`https://picsum.photos/seed/member${sub.id}${i}/100/100`} 
                              alt="Miembro" 
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center text-[8px] font-bold text-primary shadow-sm">
                          +{sub.totalSlots - 3}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-outline uppercase tracking-tighter">Miembros activos</span>
                    </div>

                    <Button asChild className="w-full h-10 bg-primary text-white rounded-xl font-sora font-bold text-xs shadow-md shadow-primary/10 active:scale-95 transition-all hover:bg-primary/90">
                      <Link href={`/checkout/${sub.id}`}>Unirse al Grupo</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-2xl">
              <p className="text-muted-foreground text-sm">No se encontraron grupos disponibles.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}