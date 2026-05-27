
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/mis-grupos", label: "Grupos", icon: "grid_view" },
  { href: "/billetera", label: "Wallet", icon: "wallet" },
  { href: "/perfil", label: "Perfil", icon: "person" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Evita errores de hidratación asegurando que el estado activo se calcule solo en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[200] px-8 pointer-events-none">
      <nav className="max-w-[220px] mx-auto vision-dock flex justify-around items-center h-10 rounded-full px-1 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300",
                isActive ? "text-primary" : "text-on-surface-variant/20"
              )}
            >
              <div className={cn(
                "transition-all duration-200",
                isActive ? "scale-105" : "scale-100"
              )}>
                <span 
                  className="material-symbols-outlined text-[16px]" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300" }}
                >
                  {item.icon}
                </span>
              </div>
              
              {isActive && (
                <div className="absolute -bottom-1 w-0.5 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(67,67,213,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
