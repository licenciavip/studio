
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/explorar", label: "Explorar", icon: "explore" },
  { href: "/mis-grupos", label: "Grupos", icon: "group" },
  { href: "/billetera", label: "Billetera", icon: "account_balance_wallet" },
  { href: "/ayuda", label: "Perfil", icon: "person" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-white/90 backdrop-blur-lg border-t border-outline-variant/30 shadow-[0_-4px_12px_rgba(67,67,213,0.08)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-3 py-1 transition-all duration-200",
              isActive 
                ? "text-primary bg-primary-fixed/30 rounded-xl scale-95" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
