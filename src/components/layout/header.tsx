"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Share2, Bell, Globe, User, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/publicar", label: "Compartir" },
  { href: "/explorar", label: "Unirme" },
  { href: "/mis-ordenes", label: "Mis Órdenes" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Share2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-headline">CupoCompartido</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notificaciones</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
              <span className="sr-only">Moneda/País</span>
            </Button>
            <Link href="/billetera" className="flex items-center gap-2">
                 <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Perfil</span>
                </Button>
                <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold ml-1">4.9</span>
                </div>
            </Link>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <SheetDescription className="sr-only">
                    Navegación principal y opciones de perfil
                </SheetDescription>
                <div className="grid gap-4 py-6">
                  <Link href="/" className="flex items-center gap-2 font-bold mb-4">
                    <Share2 className="h-6 w-6 text-primary" />
                    <span className="text-xl font-headline">CupoCompartido</span>
                  </Link>
                  <nav className="grid gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex w-full items-center py-2 text-lg font-medium",
                          pathname === link.href ? "text-primary" : "text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t pt-4 mt-4 grid gap-2">
                     <Link href="/billetera" className="flex items-center py-2 text-lg font-medium">
                        <User className="mr-2 h-5 w-5" />
                        Perfil
                     </Link>
                     <button className="flex items-center py-2 text-lg font-medium text-left">
                        <Bell className="mr-2 h-5 w-5" />
                        Notificaciones
                     </button>
                      <button className="flex items-center py-2 text-lg font-medium text-left">
                        <Globe className="mr-2 h-5 w-5" />
                        Moneda/País
                     </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
