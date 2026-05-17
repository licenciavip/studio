"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Explore", icon: "explore" },
  { href: "/mis-grupos", label: "Groups", icon: "group" },
  { href: "/billetera", label: "Wallet", icon: "account_balance_wallet" },
  { href: "/perfil", label: "Profile", icon: "person" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 pb-safe bg-surface/90 backdrop-blur-lg border-t border-outline-variant/30 shadow-[0_-4px_12px_rgba(67,67,213,0.08)] rounded-t-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 cursor-pointer min-w-[64px]",
              isActive 
                ? "text-primary scale-100" 
                : "text-on-surface-variant hover:text-primary scale-95"
            )}
          >
            <div className={cn(
              "px-5 py-1 rounded-xl transition-colors mb-1 flex items-center justify-center",
              isActive ? "bg-primary-fixed/40" : "bg-transparent"
            )}>
              <span 
                className="material-symbols-outlined" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
            </div>
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
