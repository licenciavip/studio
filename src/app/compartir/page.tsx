
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Film,
  Music,
  School,
  Gamepad2,
  Palette,
  ShieldCheck,
  BrainCircuit,
  Swords,
  HeartPulse,
  Settings2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CategorySlug } from "@/lib/types";

type Category = {
  title: string;
  slug: CategorySlug;
  icon: React.ReactNode;
};

const categories: Category[] = [
  { title: "Películas y Series", slug: "streaming", icon: <Film className="h-8 w-8 text-primary" /> },
  { title: "Gaming", slug: "gaming", icon: <Gamepad2 className="h-8 w-8 text-primary" /> },
  { title: "Diseño", slug: "diseno", icon: <Palette className="h-8 w-8 text-primary" /> },
  { title: "Música", slug: "musica", icon: <Music className="h-8 w-8 text-primary" /> },
  { title: "Deportes", slug: "deportes", icon: <Swords className="h-8 w-8 text-primary" /> },
  { title: "VPNs y Seguridad", slug: "seguridad", icon: <ShieldCheck className="h-8 w-8 text-primary" /> },
  { title: "Inteligencia Artificial", slug: "ia", icon: <BrainCircuit className="h-8 w-8 text-primary" /> },
  { title: "Educación", slug: "educacion", icon: <School className="h-8 w-8 text-primary" /> },
  { title: "Software", slug: "software", icon: <Settings2 className="h-8 w-8 text-primary" /> },
  { title: "Bienestar", slug: "bienestar", icon: <HeartPulse className="h-8 w-8 text-primary" /> },
];

export default function CompartirPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Regresar
                </Link>
            </Button>
        </div>
        <div className="flex-[2] text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Selecciona una categoría
            </h1>
        </div>
        <div className="flex-1"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link href={`/compartir/${category.slug}`} key={category.title}>
            <Card className="flex items-center p-4 h-full transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer border-none shadow-sm bg-card">
              <div className="bg-primary/10 p-3 rounded-lg mr-4">
                 {category.icon}
              </div>
              <CardHeader className="p-0">
                <CardTitle className="font-sans text-base font-semibold">
                  {category.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
