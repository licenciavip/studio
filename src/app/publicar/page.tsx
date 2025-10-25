
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
import { Info, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { servicesByCategory } from "@/lib/data";

const PLATFORM_FEE = 0.1; // 10%

function PublicarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const serviceParam = searchParams.get("service");

  const [netoDeseado, setNetoDeseado] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const service = useMemo(() => {
    if (!categoryParam || !serviceParam) return null;
    // @ts-ignore
    const services = servicesByCategory[categoryParam];
    if (!services) return null;
    return services.find(s => s.id === serviceParam);
  }, [categoryParam, serviceParam]);

  const precioFinal = useMemo(() => {
    const neto = parseFloat(netoDeseado);
    if (isNaN(neto) || neto <= 0) {
      return 0;
    }
    return neto / (1 - PLATFORM_FEE);
  }, [netoDeseado]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "¡Grupo publicado!",
        description: "Tu oferta de suscripción ya está visible para todos.",
      });
      router.push("/mis-grupos");
    }, 1500);
  };
  
  const serviceName = service ? service.name : 'un Grupo';

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="relative text-center mb-8">
        <Button asChild variant="outline" className="absolute left-0 top-1/2 -translate-y-1/2">
            <Link href={`/compartir/${categoryParam || ''}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Regresar
            </Link>
        </Button>
        <h1 className="text-3xl font-headline font-bold">
            Publicar un Grupo de {serviceName}
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardDescription>
              Comparte tu suscripción y gana dinero. Nosotros nos encargamos de la gestión.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slots">Cupos para compartir</Label>
              <Input id="slots" name="slots" type="number" placeholder="Ej: 3" min="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="net-earnings">Neto deseado por cupo (USD)</Label>
              <Input
                id="net-earnings"
                name="net-earnings"
                type="number"
                placeholder="Ej: 8.50"
                step="0.01"
                min="0.50"
                required
                value={netoDeseado}
                onChange={(e) => setNetoDeseado(e.target.value)}
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Precio Final para el Cliente</AlertTitle>
              <AlertDescription>
                El precio final por cupo será de{" "}
                <span className="font-bold text-primary">${precioFinal.toFixed(2)}</span>. Esto incluye
                nuestra comisión de servicio.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button asChild variant="ghost">
                <Link href="/compartir">Cancelar</Link>
            </Button>
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Publicando..." : "Publicar Grupo"}
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
