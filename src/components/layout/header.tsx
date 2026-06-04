"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share2, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <header className="fixed top-0 left-0 right-0 z-[150] px-4 pt-3 pointer-events-none">
      <div className="max-w-xl mx-auto flex justify-between items-center h-10 bg-white/20 backdrop-blur-3xl border border-white/40 rounded-full px-4 shadow-sm pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/10">
            <Share2 className="h-3 w-3" />
          </div>
          <Link href="/">
            <span className="text-[11px] font-black text-on-surface tracking-tighter uppercase">Poolera</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {!isLoginPage && (
            <Link href="/explorar" className={cn(
              "h-7 px-3 flex items-center gap-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all active:scale-90",
              pathname.startsWith("/explorar") ? "bg-primary/10 text-primary" : "text-on-surface-variant/30 hover:text-primary hover:bg-primary/5"
            )}>
              <Compass className="h-3 w-3" />
              <span>Explorar</span>
            </Link>
          )}
          <Link href={isLoginPage ? "/" : "/perfil"} className="w-7 h-7 flex items-center justify-center text-on-surface-variant/30 hover:text-primary transition-all active:scale-90">
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}