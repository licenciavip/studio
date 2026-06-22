'use client';

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { ServiceDoc } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  ia: "IA & Herramientas",
};

export default function CompartirCategoryPage() {
  const params = useParams();
  const category = (params.category as string) || "ia";
  const firestore = useFirestore();

  const servicesQuery = useMemo(
    () => (firestore ? query(collection(firestore, "services"), where("category", "==", category)) : null),
    [firestore, category]
  );
  const { data: servicesRaw, loading } = useCollection<ServiceDoc>(servicesQuery);
  const services = (servicesRaw ?? []).filter((s) => s.active !== false);

  const categoryLabel = categoryLabels[category] || "Servicios";

  return (
    <div className="min-h-screen pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" className="rounded-full h-8 w-8 p-0 bg-white/40 hover:bg-white/60 active:scale-95 transition-all">
          <Link href="/compartir"><ArrowLeft className="h-4 w-4 text-on-surface" /></Link>
        </Button>
        <div>
          <h1 className="text-base font-sora font-extrabold tracking-tight text-on-surface">{categoryLabel}</h1>
          <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Selecciona plataforma</p>
        </div>
      </div>

      {loading && <p className="py-10 text-center text-[10px] font-black uppercase tracking-widest text-on-surface/30">Cargando…</p>}
      {!loading && services.length === 0 && (
        <div className="glass-card rounded-[2rem] py-12 text-center">
          <p className="text-[11px] font-bold text-on-surface/40">No hay servicios en esta categoría</p>
        </div>
      )}

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {services.map((service) => {
          const host = Math.max(0, (service.pricePerMonth ?? 0) - (service.platformFee ?? 0));
          const isWhiteBg = service.color?.toLowerCase() === "#ffffff";
          return (
            <Link href={`/publicar?category=${category}&service=${service.id}`} key={service.id} className="block group">
              <div
                className={cn(
                  "relative rounded-2xl p-3 aspect-square flex flex-col justify-between transition-all duration-500 hover:scale-[1.03] active:scale-95 overflow-hidden border-none",
                  isWhiteBg ? "glass-card" : "shadow-lg shadow-black/5"
                )}
                style={{ backgroundColor: !isWhiteBg ? (service.color || '#4343d5') : undefined }}
              >
                {!isWhiteBg && <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />}
                <div className="relative z-10 space-y-0.5">
                  <h3 className={cn("text-xs sm:text-sm font-bold tracking-tight leading-tight truncate", isWhiteBg ? "text-primary" : "text-white")}>{service.name}</h3>
                  <p className={cn("text-[9px] font-medium uppercase tracking-[0.03em]", isWhiteBg ? "text-on-surface-variant/60" : "text-white/70")}>Vendiendo</p>
                </div>
                <div className="relative z-10 space-y-0.5">
                  <p className={cn("text-[9px] font-bold uppercase tracking-[0.03em]", isWhiteBg ? "text-on-surface-variant/40" : "text-white/60")}>Recibes</p>
                  <span className={cn("text-sm sm:text-base font-sora font-extrabold tracking-tight", isWhiteBg ? "text-primary" : "text-white")}>S/ {host.toFixed(2)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
