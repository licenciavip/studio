
"use client";

import { BrainCircuit, ArrowLeft, ChevronRight, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CategorySlug } from "@/lib/types";

type Category = {
  title: string;
  slug: CategorySlug;
  icon: React.ReactNode;
};

const categories: Category[] = [
  { title: "Inteligencia Artificial", slug: "ia", icon: <BrainCircuit className="h-5 w-5" /> },
];

export default function CompartirPage() {
  return (
    <div className="pb-24 pt-2 space-y-6">
      {/* Header Compacto Apple Style */}
      <div className="flex items-center gap-3 px-1">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/40 hover:bg-white/60 active:scale-95 transition-all">
          <Link href="/inicio">
            <ArrowLeft className="h-4 w-4 text-primary" />
          </Link>
        </Button>
        <div className="space-y-0">
          <h1 className="text-lg font-extrabold tracking-tight text-on-surface">Compartir</h1>
          <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">¿Qué quieres lankear?</p>
        </div>
      </div>

      {/* Lista de Categorías de Alta Densidad */}
      <div className="grid grid-cols-1 gap-2">
        {categories.map((category) => (
          <Link href={`/compartir/${category.slug}`} key={category.title} className="group">
            <div className="glass-card flex items-center justify-between p-4 rounded-[1.8rem] hover:bg-white/50 transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-300 shadow-sm border border-primary/5">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-on-surface tracking-tight">
                    {category.title}
                  </h3>
                  <p className="text-[9px] text-on-surface-variant/40 font-medium uppercase tracking-tighter">
                    Vende tus cupos libres
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-on-surface-variant/20 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}

        {/* Espacio reservado para expansión visual */}
        <div className="p-6 border-2 border-dashed border-primary/5 rounded-[2rem] flex flex-col items-center justify-center gap-2 opacity-30 mt-4">
           <Share2 className="h-5 w-5 text-primary/40" />
           <p className="text-[10px] font-bold text-center uppercase tracking-widest text-primary/40">Más servicios próximamente</p>
        </div>
      </div>
    </div>
  );
}
