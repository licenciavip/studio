import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, PlusCircle, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Tu centro de suscripciones compartidas
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Ahorra dinero compartiendo tus suscripciones o únete a grupos existentes de forma segura y sencilla.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <Link href="/publicar">
            <CardHeader className="flex-row items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="font-headline text-2xl">Compartir una suscripción</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Crea un grupo, invita a otros y reduce tus gastos mensuales. ¡Es rápido y fácil!
              </CardDescription>
            </CardContent>
            <CardContent>
               <div className="flex items-center text-sm font-semibold text-primary">
                  Empezar a compartir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <Link href="/explorar">
            <CardHeader className="flex-row items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                 <PlusCircle className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="font-headline text-2xl">Unirme a una suscripción</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Encuentra cupos disponibles en tus servicios favoritos y empieza a ahorrar hoy mismo.
              </CardDescription>
            </CardContent>
            <CardContent>
               <div className="flex items-center text-sm font-semibold text-primary">
                  Buscar grupos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}