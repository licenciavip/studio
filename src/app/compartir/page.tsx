import {
  Card,
  CardDescription,
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
} from "lucide-react";
import Link from "next/link";

type Category = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
};

const categories: Category[] = [
  {
    title: "Películas y Series",
    description: "Netflix, Disney+, HBO Max",
    icon: <Film className="h-10 w-10 text-primary" />,
    href: "/publicar?category=streaming",
  },
  {
    title: "Música",
    description: "Spotify, Apple Music, Tidal",
    icon: <Music className="h-10 w-10 text-primary" />,
    href: "/publicar?category=musica",
  },
  {
    title: "Educación",
    description: "Coursera, Duolingo, Platzi",
    icon: <School className="h-10 w-10 text-primary" />,
    href: "/publicar?category=educacion",
  },
  {
    title: "Gaming",
    description: "PS Plus, Xbox Game Pass",
    icon: <Gamepad2 className="h-10 w-10 text-primary" />,
    href: "/publicar?category=gaming",
  },
  {
    title: "Diseño",
    description: "Adobe Creative Cloud, Canva",
    icon: <Palette className="h-10 w-10 text-primary" />,
    href: "/publicar?category=diseno",
  },
  {
    title: "VPNs y Seguridad",
    description: "NordVPN, ExpressVPN",
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    href: "/publicar?category=seguridad",
  },
  {
    title: "Inteligencia Artificial",
    description: "ChatGPT Plus, Midjourney",
    icon: <BrainCircuit className="h-10 w-10 text-primary" />,
    href: "/publicar?category=ia",
  },
  {
    title: "Deportes",
    description: "Star+, NBA League Pass",
    icon: <Swords className="h-10 w-10 text-primary" />,
    href: "/publicar?category=deportes",
  },
  {
    title: "Bienestar",
    description: "Calm, Headspace",
    icon: <HeartPulse className="h-10 w-10 text-primary" />,
    href: "/publicar?category=bienestar",
  },
  {
    title: "Software",
    description: "Microsoft 365, Setapp",
    icon: <Settings2 className="h-10 w-10 text-primary" />,
    href: "/publicar?category=software",
  },
];

export default function CompartirPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Comparte tu Suscripción
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Selecciona la categoría del servicio que quieres compartir.
        </p>
      </div>

       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link href={category.href} key={category.title}>
            <Card className="text-center flex flex-col items-center justify-center p-6 h-full transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
              <CardHeader className="p-0">
                {category.icon}
                <CardTitle className="mt-4 font-headline text-lg">
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