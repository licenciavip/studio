
"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2, ArrowLeft, TrendingUp, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { servicesByCategory } from "@/lib/data";

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
    <div className="container mx-auto max-w-lg py-6 px-4">
      <div className="flex items-center mb-6">
        <Button asChild variant="ghost" size="icon" className="rounded-full mr-2">
          <Link href={`/compartir/${categoryParam || ''}`}>
              <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-sora font-black tracking-tighter">Comparte {serviceName}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="rounded-[2.5rem] border-none shadow-[0_10px_40px_-10px_rgb(0,0,0,0.06)] overflow-hidden bg-white">
          <CardHeader className="bg-primary/5 border-b border-outline-variant/10 p-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Wallet className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-black tracking-tighter">Configura tu Ganancia</CardTitle>
            <CardDescription className="text-xs font-medium">Define cuánto dinero quieres que entre a tu cuenta por cada cupo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8 pt-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="net-earnings" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">¿Cuánto quieres recibir por cupo? (S/)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary text-xl">S/</span>
                  <Input
                    id="net-earnings"
                    type="number"
                    placeholder="15.00"
                    step="0.01"
                    min="1"
                    required
                    value={netoDeseado}
                    onChange={(e) => setNetoDeseado(e.target.value)}
                    className="rounded-2xl h-14 pl-12 text-xl font-black text-primary border-outline-variant/30 focus-visible:ring-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slots" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cupos disponibles para vender</Label>
                <Input 
                  id="slots" 
                  type="number" 
                  value={slots} 
                  onChange={(e) => setSlots(e.target.value)}
                  min="1" 
                  max="10"
                  required 
                  className="rounded-2xl h-12 text-sm font-bold border-outline-variant/30" 
                />
              </div>
            </div>

            <div className="bg-secondary/5 p-6 rounded-[2rem] border border-secondary/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Precio Final al Público</span>
                <span className="text-sm font-black text-on-surface">S/ {calculations.precioVenta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-secondary/10 pt-4">
                <div className="flex items-center gap-2">
                   <TrendingUp className="h-4 w-4 text-secondary" />
                   <span className="text-[11px] font-black text-on-surface uppercase tracking-tighter">Tus Ingresos Mensuales</span>
                </div>
                <span className="text-2xl font-sora font-black text-secondary">S/ {calculations.totalMes.toFixed(2)}</span>
              </div>
            </div>

            <Alert className="bg-primary/5 border-none rounded-2xl py-4 px-5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-[10px] font-bold text-primary/70 leading-relaxed">
                SubShare gestiona el cobro a tus miembros y asegura que recibas tu dinero puntualmente cada mes.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button type="submit" className="w-full rounded-2xl h-14 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isSubmitting ? "Publicando..." : "Lanzar mi Grupo"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function PublicarPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando...</div>}>
            <PublicarForm />
        </Suspense>
    )
}
