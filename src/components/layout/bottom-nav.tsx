"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/mis-grupos", label: "Mis Grupos", icon: "grid_view" },
  { href: "/billetera", label: "Billetera", icon: "wallet" },
  { href: "/perfil", label: "Perfil", icon: "person" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[200] px-6">
      <nav className="max-w-md mx-auto vision-dock flex justify-around items-center h-14 rounded-[1.8rem] px-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300",
                isActive ? "text-primary" : "text-on-surface-variant/30"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300 ease-out",
                isActive ? "scale-105" : "scale-100 hover:text-on-surface"
              )}>
                <span 
                  className="material-symbols-outlined text-[20px]" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300" }}
                >
                  {item.icon}
                </span>
              </div>
              
              {isActive && (
                <div className="absolute -bottom-0.5 w-0.5 h-0.5 bg-primary rounded-full shadow-[0_0_6px_rgba(67,67,213,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}