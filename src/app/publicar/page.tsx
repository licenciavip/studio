"use client";

import { useState, useMemo } from "react";
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
import { Info, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PLATFORM_FEE = 0.1; // 10%

export default function PublicarPage() {
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
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "¡Grupo publicado!",
        description: "Tu oferta de suscripción ya está visible para todos.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Publicar un Grupo</CardTitle>
            <CardDescription>
              Comparte tu suscripción y gana dinero. Nosotros nos encargamos de la gestión.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="service">Servicio de Suscripción</Label>
              <Select name="service" required>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Elige un servicio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="netflix">Netflix</SelectItem>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="disney-plus">Disney+</SelectItem>
                  <SelectItem value="hbo-max">HBO Max</SelectItem>
                  <SelectItem value="youtube-premium">YouTube Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <CardFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Publicando..." : "Publicar Grupo"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
