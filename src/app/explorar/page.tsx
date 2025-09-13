import { subscriptions } from "@/lib/data";
import SubscriptionCard from "@/components/subscription-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Music, School } from "lucide-react";

type Category = {
  title: string;
  icon: React.ReactNode;
  services: string[];
};

const categories: Category[] = [
  {
    title: "Películas y Series",
    icon: <Film className="h-6 w-6 text-primary" />,
    services: ["Netflix", "Disney+", "HBO Max"],
  },
  {
    title: "Música",
    icon: <Music className="h-6 w-6 text-primary" />,
    services: ["Spotify"],
  },
  {
    title: "Educación y Productividad",
    icon: <School className="h-6 w-6 text-primary" />,
    services: ["ChatGPT", "YouTube Premium"],
  },
];

export default function ExplorarPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Explora Nuestros Grupos
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Encuentra y únete a grupos para compartir tus suscripciones favoritas o publica la tuya.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.title}>
            <div className="flex items-center gap-4 mb-6">
              {category.icon}
              <h2 className="text-2xl font-headline font-bold">{category.title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subscriptions
                .filter((sub) => category.services.includes(sub.service))
                .map((sub) => (
                  <SubscriptionCard key={sub.id} subscription={sub} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
