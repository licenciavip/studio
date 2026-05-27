"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/mis-grupos", label: "Mis Grupos", icon: "group" },
  { href: "/billetera", label: "Billetera", icon: "account_balance_wallet" },
  { href: "/perfil", label: "Perfil", icon: "person" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-6">
      <nav className="max-w-md mx-auto flex justify-around items-center h-16 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-2xl shadow-black/10 px-2 overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300",
                isActive ? "text-primary" : "text-on-surface-variant/60"
              )}
            >
              {isActive && (
                <div className="absolute top-1 w-8 h-1 bg-primary rounded-full blur-[1px]" />
              )}
              <div className={cn(
                "p-2 rounded-2xl transition-all duration-300",
                isActive ? "scale-110" : "scale-100 hover:text-on-surface"
              )}>
                <span 
                  className="material-symbols-outlined text-[20px]" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
              </div>
              <span className={cn(
                "text-[9px] font-bold tracking-tight transition-all",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
