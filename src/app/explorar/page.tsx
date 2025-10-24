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

type Category = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

const categories: Category[] = [
  {
    title: "Películas y Series",
    icon: <Film className="h-8 w-8 text-primary" />,
    href: "/explorar/streaming",
  },
  {
    title: "Gaming",
    icon: <Gamepad2 className="h-8 w-8 text-primary" />,
    href: "/explorar/gaming",
  },
  {
    title: "Diseño",
    icon: <Palette className="h-8 w-8 text-primary" />,
    href: "/explorar/diseno",
  },
  {
    title: "Música",
    icon: <Music className="h-8 w-8 text-primary" />,
    href: "/explorar/musica",
  },
  {
    title: "Deportes",
    icon: <Swords className="h-8 w-8 text-primary" />,
    href: "/explorar/deportes",
  },
  {
    title: "VPNs",
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    href: "/explorar/seguridad",
  },
    {
    title: "Inteligencia Artificial",
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    href: "/explorar/ia",
  },
  {
    title: "Educación",
    icon: <School className="h-8 w-8 text-primary" />,
    href: "/explorar/educacion",
  },
    {
    title: "Software",
    icon: <Settings2 className="h-8 w-8 text-primary" />,
    href: "/explorar/software",
  },
    {
    title: "Bienestar",
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    href: "/explorar/bienestar",
  },
];

export default function ExplorarPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative text-center mb-10">
         <Button asChild variant="outline" className="absolute left-0 top-1/2 -translate-y-1/2">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Regresar
            </Link>
        </Button>
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Únete a un Grupo Compartido
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link href={category.href} key={category.title}>
            <Card className="flex items-center p-4 h-full transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer">
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
