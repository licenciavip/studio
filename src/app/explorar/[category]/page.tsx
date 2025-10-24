// This file will be implemented in the next step to show services from Firebase.
// For now, it's a placeholder.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const categoryNames: Record<string, string> = {
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

export default function CategoryPage({ params }: { params: { category: string } }) {
    const categoryName = categoryNames[params.category] || "Categoría";
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
                Selecciona un servicio
            </h1>
             <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Categoría: {categoryName}
            </p>
            </div>
            <div className="flex-1"></div>
        </div>
         <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            El siguiente paso será cargar los servicios de esta categoría desde Firebase.
          </p>
        </div>
    </div>
  );
}
