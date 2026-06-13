"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Compass, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <header className="lg-header">
      <div className="lg-header-inner">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#5E5CE6] to-primary shadow-[0_2px_8px_rgba(10,132,255,0.35),inset_0_1px_0_rgba(255,255,255,0.30)]">
            <Layers className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          </div>
          <span className="text-[13px] font-bold tracking-tighter text-on-surface">
            Poolera
          </span>
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          {!isLoginPage && (
            <Link
              href="/explorar"
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold tracking-tight no-underline transition-colors",
                pathname.startsWith("/explorar")
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface/55 hover:text-on-surface/80"
              )}
            >
              <Compass className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>Explorar</span>
            </Link>
          )}
          <Link
            href={isLoginPage ? "/" : "/perfil"}
            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface/55 transition-colors hover:text-on-surface/80"
          >
            <User className="h-4 w-4" strokeWidth={1.7} />
          </Link>
        </div>
      </div>
    </header>
  );
}
