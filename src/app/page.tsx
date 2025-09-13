import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share2, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            asChild
            size="lg"
            className="h-16 w-full sm:w-auto text-lg px-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <Link href="/compartir">
              <Share2 className="mr-3 h-6 w-6" />
              Compartir mi suscripción
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="h-16 w-full sm:w-auto text-lg px-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <Link href="/explorar">
              <UserPlus className="mr-3 h-6 w-6" />
              Unirme a una suscripci&oacute;n
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
