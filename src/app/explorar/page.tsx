
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BrainCircuit,
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
  { title: "Inteligencia Artificial", slug: "ia", icon: <BrainCircuit className="h-6 w-6 text-primary" /> },
];

export default function ExplorarPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regresar
            </Link>
          </Button>
        </div>
        <div className="flex-[4] text-center">
          <h1 className="text-2xl font-sora font-bold tracking-tight">
            Selecciona una categoría
          </h1>
        </div>
        <div className="flex-1"></div>
      </div>

      <div className="max-w-xs mx-auto">
        {categories.map((category) => (
          <Link href={`/explorar/${category.slug}`} key={category.title}>
            <Card className="flex items-center p-4 h-full transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer border border-outline-variant/30 shadow-sm bg-card rounded-2xl">
              <div className="bg-primary/10 p-2.5 rounded-xl mr-4">
                 {category.icon}
              </div>
              <CardHeader className="p-0">
                <CardTitle className="font-sora text-sm font-bold">
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
