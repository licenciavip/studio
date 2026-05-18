
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
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-surface/90 backdrop-blur-lg border-t border-outline-variant/30 shadow-[0_-4px_10px_rgba(67,67,213,0.05)] h-14">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-0.5 transition-all duration-200 cursor-pointer min-w-[56px]",
              isActive 
                ? "text-primary scale-100" 
                : "text-on-surface-variant hover:text-on-surface scale-95"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-colors mb-0.5 flex items-center justify-center",
              isActive ? "bg-primary/10" : "bg-transparent"
            )}>
              <span 
                className="material-symbols-outlined text-[18px]" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
            </div>
            <span className={cn(
              "text-[8px] leading-tight font-bold",
              isActive ? "opacity-100" : "opacity-70"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
