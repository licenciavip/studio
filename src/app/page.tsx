import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  PlusCircle,
  Users,
  Film,
  Music,
  School,
  Gamepad2,
  Tv,
  BrainCircuit,
} from "lucide-react";
import { orders } from "@/lib/data";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      className={cn("absolute top-2 right-2", {
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300":
          status === "Activo",
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300":
          status === "Pendiente",
        "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300":
          status === "En disputa",
      })}
      variant="outline"
    >
      {status}
    </Badge>
  );
}

const categories = [
  { name: "Películas", icon: Film },
  { name: "Música", icon: Music },
  { name: "Educación", icon: School },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Deportes", icon: Tv },
  { name: "Software", icon: BrainCircuit },
];

export default function Home() {
  const activeOrders = orders.filter((o) => o.status === "Activo");

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Mis Grupos Section */}
      <div>
        <h2 className="text-3xl font-headline font-bold mb-6">Mis Grupos</h2>
        {activeOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map((order) => {
              const logo = PlaceHolderImages.find(
                (img) => img.id === order.logoId
              );
              return (
                <Card
                  key={order.id}
                  className="relative transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <Link href={`/mis-ordenes`}>
                    <CardHeader>
                      {logo && (
                        <Image
                          src={logo.imageUrl}
                          alt={logo.description}
                          width={40}
                          height={40}
                          className="rounded-md"
                          data-ai-hint={logo.imageHint}
                        />
                      )}
                      <StatusBadge status={order.status} />
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="font-headline text-xl">
                        {order.service}
                      </CardTitle>
                      <CardDescription>
                        Anfitrión: {order.host}
                      </CardDescription>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center p-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Aún no te has unido a ningún grupo.
              </p>
              <Button asChild>
                <Link href="/explorar">Explorar Grupos</Link>
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="mt-6 flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href="/mis-ordenes">
              Ver todos mis grupos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" disabled>Mis horarios de contacto</Button>
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <h2 className="text-3xl font-headline font-bold mb-6">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href="/explorar">
              <Card className="flex flex-col items-center justify-center p-4 h-32 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-muted/50">
                <category.icon className="h-8 w-8 text-primary mb-2" />
                <p className="font-semibold text-sm">{category.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

       {/* Unirse a un grupo Button */}
       <div className="text-center pt-8">
           <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground transition-transform hover:scale-105">
             <Link href="/explorar">
                <PlusCircle className="mr-2 h-5 w-5"/>
                Unirse a un Grupo
             </Link>
           </Button>
       </div>

    </div>
  );
}
