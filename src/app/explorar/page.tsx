
"use client";

import { BrainCircuit, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

type Category = {
  title: string;
  slug: CategorySlug;
  icon: React.ReactNode;
};

const categories: Category[] = [
  { title: "Inteligencia Artificial", slug: "ia", icon: <BrainCircuit className="h-5 w-5" /> },
];

export default function ExplorarPage() {
  return (
    <div className="pb-24 pt-2 space-y-6">
      {/* Mini Header estilo iOS */}
      <div className="flex items-center gap-3 px-1">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/40 hover:bg-white/60 active:scale-95 transition-all">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 text-primary" />
          </Link>
        </Button>
        <div className="space-y-0">
          <h1 className="text-lg font-extrabold tracking-tight text-on-surface">Explorar</h1>
          <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Elige una categoría</p>
        </div>
      </div>

      {/* Grid de Categorías Compacto */}
      <div className="grid grid-cols-1 gap-2">
        {categories.map((category) => (
          <Link href={`/explorar/${category.slug}`} key={category.title} className="group">
            <div className="glass-card flex items-center justify-between p-4 rounded-[1.8rem] hover:bg-white/50 transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm border border-primary/5">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-on-surface tracking-tight">
                    {category.title}
                  </h3>
                  <p className="text-[9px] text-on-surface-variant/40 font-medium uppercase tracking-tighter">
                    Descubre servicios premium
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-on-surface-variant/20 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}

        {/* Placeholder para futuras categorías - Densidad visual */}
        {[1, 2].map((i) => (
          <div key={i} className="glass-card opacity-20 p-4 rounded-[1.8rem] border-dashed flex items-center gap-4">
             <div className="w-10 h-10 rounded-2xl bg-on-surface/5" />
             <div className="space-y-1">
                <div className="w-24 h-2 bg-on-surface/10 rounded-full" />
                <div className="w-16 h-1.5 bg-on-surface/5 rounded-full" />
             </div>
          </div>
        ))}
      </div>

      {/* Tip Minimalista */}
      <div className="text-center pt-4">
        <p className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.3em]">
          Nuevas categorías pronto
        </p>
      </div>
    </div>
  );
}
