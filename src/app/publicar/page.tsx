
"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Loader2, ArrowLeft, TrendingUp, Wallet, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { servicesByCategory } from "@/lib/data";
import { cn } from "@/lib/utils";

const PLATFORM_FEE = 0.1; // 10% de comisión de SubShare

function PublicarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const serviceParam = searchParams.get("service");

  const [netoDeseado, setNetoDeseado] = useState("");
  const [slots, setSlots] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const service = useMemo(() => {
    if (!categoryParam || !serviceParam) return null;
    // @ts-ignore
    const services = servicesByCategory[categoryParam];
    if (!services) return null;
    return services.find(s => s.id === serviceParam);
  }, [categoryParam, serviceParam]);

  const calculations = useMemo(() => {
    const neto = parseFloat(netoDeseado) || 0;
    const numSlots = parseInt(slots) || 0;
    const precioVenta = neto / (1 - PLATFORM_FEE);
    const totalMes = neto * numSlots;
    
    return {
      precioVenta,
      totalMes,
    };
  }, [netoDeseado, slots]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "¡Grupo publicado!",
        description: "Tu oferta de IA ya está visible. ¡A ganar!",
      });
      router.push("/mis-grupos");
    }, 1500);
  };
  
  const serviceName = service ? service.name : 'tu Suscripción';

  return (
    <div className="max-w-md mx-auto pt-6 pb-24 px-4 space-y-4">
      {/* Mini Header Compacto */}
      <div className="flex items-center gap-3 px-1 mb-2">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/40 hover:bg-white/60 active:scale-95 transition-all">
          <Link href={`/compartir/${categoryParam || ''}`}>
            <ArrowLeft className="h-4 w-4 text-primary" />
          </Link>
        </Button>
        <div className="space-y-0">
          <h1 className="text-lg font-extrabold tracking-tight text-on-surface">Compartir</h1>
          <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em]">{serviceName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Configuration Card */}
        <div className="glass-card rounded-[2.2rem] p-6 border-white/40 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5 shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-on-surface tracking-tight">Tu Ganancia</h3>
              <p className="text-[10px] text-on-surface-variant/40 font-medium uppercase tracking-tighter">Define lo que quieres recibir</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.25em] px-1">Monto por cupo (S/)</Label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary/40 text-sm">S/</span>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  required
                  value={netoDeseado}
                  onChange={(e) => setNetoDeseado(e.target.value)}
                  className="glass-input w-full h-12 pl-10 text-lg font-extrabold text-primary tracking-tighter transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.25em] px-1">Cupos disponibles</Label>
              <div className="flex items-center gap-2">
                 <input 
                  type="number" 
                  value={slots} 
                  onChange={(e) => setSlots(e.target.value)}
                  min="1" 
                  max="10"
                  required 
                  className="glass-input flex-1 h-10 text-sm font-bold text-center" 
                />
                <div className="h-10 px-4 flex items-center justify-center bg-white/40 rounded-2xl border border-white/60 text-[10px] font-bold text-on-surface-variant/50 uppercase">
                  Máx. 10
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results / Financial Panel */}
        <div className="glass-card rounded-[2.2rem] p-6 bg-gradient-to-br from-white/20 to-primary/5 border-white/40 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Precio al Público</span>
            <span className="text-sm font-bold text-on-surface">S/ {calculations.precioVenta.toFixed(2)}</span>
          </div>
          
          <div className="h-px bg-on-surface/5 w-full" />
          
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2 text-secondary">
               <TrendingUp className="h-4 w-4" />
               <span className="text-[11px] font-black uppercase tracking-tighter">Tu ingreso mensual</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-secondary tracking-tightest">S/ {calculations.totalMes.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Info Tip visionOS Style */}
        <div className="glass-card p-4 rounded-3xl bg-primary/5 border-primary/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-primary uppercase tracking-tight">Gestión Poolera</p>
            <p className="text-[11px] font-medium text-on-surface-variant/70 leading-relaxed">
              Nos encargamos del cobro y validación. Recibe tu dinero directamente en tu Wallet cada mes.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting || !netoDeseado}
            className={cn(
              "w-full glass-button bg-primary text-white h-12 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-2",
              (isSubmitting || !netoDeseado) && "opacity-50 grayscale pointer-events-none"
            )}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isSubmitting ? "Lanzando..." : "Lanzar mi Grupo"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PublicarPage() {
    return (
        <Suspense fallback={
          <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary/20 animate-spin" />
          </div>
        }>
            <PublicarForm />
        </Suspense>
    )
}
