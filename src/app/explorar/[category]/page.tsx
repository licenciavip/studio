import SubscriptionCard from "@/components/subscription-card";
import { subscriptions } from "@/lib/data";
import type { CategorySlug } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Define un mapa de los slugs de categoría a sus títulos legibles por humanos.
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

export default function CategoryPage({ params }: { params: { category: CategorySlug } }) {
  const { category } = params;
  
  // Obtiene el nombre legible de la categoría, o muestra un 404 si no existe.
  const categoryName = categoryNames[category];
  if (!categoryName) {
    notFound();
  }

  // Filtra las suscripciones para mostrar solo las de la categoría actual.
  const categorySubscriptions = subscriptions.filter(
    (sub) => sub.category === category
  );

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1">
          <Button asChild variant="outline">
            <Link href="/explorar">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regresar
            </Link>
          </Button>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            {categoryName}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Grupos disponibles para unirte en la categoría {categoryName.toLowerCase()}. ¡Ahorra en tus servicios favoritos!
          </p>
        </div>
        <div className="flex-1"></div>
      </div>

      {categorySubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categorySubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              showAction="join"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            Actualmente no hay grupos disponibles en esta categoría.
          </p>
        </div>
      )}
    </div>
  );
}
