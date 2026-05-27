
"use client";

import Link from "next/link";
import { Share2 } from "lucide-react";

export default function Header() {
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
        
        <Link href="/perfil" className="w-7 h-7 flex items-center justify-center text-on-surface-variant/30 hover:text-primary transition-all active:scale-90">
          <span className="material-symbols-outlined text-[18px]">account_circle</span>
        </Link>
      </div>
    </header>
  );
}
