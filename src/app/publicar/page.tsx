
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
import { Info, Loader2, ArrowLeft, TrendingUp } from "lucide-react";
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
        <h1 className="text-xl font-sora font-bold">Publicar {serviceName}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="rounded-3xl border-outline-variant/30 shadow-sm overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-outline-variant/10">
            <CardTitle className="text-sm">Configuración del Grupo</CardTitle>
            <CardDescription className="text-[10px]">Indica cuánto quieres recibir por cada cupo compartido.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slots" className="text-xs uppercase font-bold text-muted-foreground">Cupos a Vender</Label>
                <Input 
                  id="slots" 
                  type="number" 
                  value={slots} 
                  onChange={(e) => setSlots(e.target.value)}
                  min="1" 
                  required 
                  className="rounded-xl h-10 text-sm font-bold" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="net-earnings" className="text-xs uppercase font-bold text-muted-foreground">Recibirás (S/)</Label>
                <Input
                  id="net-earnings"
                  type="number"
                  placeholder="Ej: 15.00"
                  step="0.01"
                  min="1"
                  required
                  value={netoDeseado}
                  onChange={(e) => setNetoDeseado(e.target.value)}
                  className="rounded-xl h-10 text-sm font-bold text-primary focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Precio al Público</span>
                <span className="text-sm font-bold text-on-surface">S/ {calculations.precioVenta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-outline-variant/10 pt-3">
                <div className="flex items-center gap-1.5">
                   <TrendingUp className="h-3.5 w-3.5 text-secondary" />
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Tus Ingresos Mensuales</span>
                </div>
                <span className="text-lg font-sora font-black text-secondary">S/ {calculations.totalMes.toFixed(2)}</span>
              </div>
            </div>

            <Alert className="bg-primary/5 border-primary/10 rounded-2xl py-3">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-[10px] text-primary/80 leading-relaxed">
                SubShare añade una pequeña comisión de servicio al precio final para gestionar los pagos y la seguridad de tu grupo.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="bg-surface-container-lowest border-t border-outline-variant/10 p-4">
            <Button type="submit" className="w-full rounded-xl py-6 text-sm font-bold shadow-lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isSubmitting ? "Procesando..." : "Confirmar y Publicar"}
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
