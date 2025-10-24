
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CategorySlug } from "@/lib/types";
import Link from "next/link";

const PLATFORM_FEE = 0.1; // 10%

const categoryServices = {
  streaming: [
    { value: "netflix", label: "Netflix" },
    { value: "disney-plus", label: "Disney+" },
    { value: "hbo-max", label: "HBO Max" },
    { value: "youtube-premium", label: "YouTube Premium" },
    { value: "star-plus", label: "Star+" },
  ],
  musica: [{ value: "spotify", label: "Spotify" }, { value: "apple-music", label: "Apple Music" }, { value: "tidal", label: "Tidal" }],
  educacion: [{ value: "coursera", label: "Coursera" }, { value: "duolingo", label: "Duolingo" }, { value: "platzi", label: "Platzi" }],
  gaming: [{ value: "ps-plus", label: "PS Plus" }, { value: "xbox-game-pass", label: "Xbox Game Pass" }],
  diseno: [{ value: "adobe-cc", label: "Adobe Creative Cloud" }, { value: "canva", label: "Canva" }],
  seguridad: [{ value: "nordvpn", label: "NordVPN" }, { value: "expressvpn", label: "ExpressVPN" }],
  ia: [{ value: "chatgpt", label: "ChatGPT Plus" }, { value: "midjourney", label: "Midjourney" }],
  deportes: [{ value: "star-plus-deportes", label: "Star+ (Deportes)" }, { value: "nba-league-pass", label: "NBA League Pass" }],
  bienestar: [{ value: "calm", label: "Calm" }, { value: "headspace", label: "Headspace" }],
  software: [{ value: "microsoft-365", label: "Microsoft 365" }, { value: "setapp", label: "Setapp" }],
};

const categoryNames: Record<CategorySlug, string> = {
  streaming: "Películas y Series",
  musica: "Música",
  educacion: "Educación",
  gaming: "Gaming",
  diseno: "Diseño",
  seguridad: "VPNs y Seguridad",
  ia: "Inteligencia Artificial",
  deportes: "Deportes",
  bienestar: "Bienestar",
  software: "Software",
};

function PublicarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");

  const [netoDeseado, setNetoDeseado] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
  
  const serviceName = serviceParam ? serviceParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'un Grupo';

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="relative text-center mb-8">
        <Button asChild variant="outline" className="absolute left-0 top-1/2 -translate-y-1/2">
            <Link href="/compartir">
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
