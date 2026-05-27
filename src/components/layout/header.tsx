"use client";

import Link from "next/link";
import { useAuth } from "@/firebase";
import { Share2 } from "lucide-react";

export default function Header() {
  const auth = useAuth();
  const user = auth?.currentUser;

  return (
    <header className="fixed top-0 left-0 right-0 z-[150] px-4 pt-4">
      <div className="max-w-2xl mx-auto flex justify-between items-center h-12 bg-white/25 backdrop-blur-2xl border border-white/20 rounded-[1.4rem] px-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/10 transition-transform active:scale-95">
            <Share2 className="h-3.5 w-3.5 text-white" />
          </div>
          <Link href="/">
            <span className="text-base font-bold text-on-surface tracking-tighter">SubShare</span>
          </Link>
        </div>
        
        <Link href="/perfil" className="w-8 h-8 flex items-center justify-center text-on-surface-variant/40 hover:text-primary transition-all active:scale-90">
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
        </Link>
      </div>
    </header>
  );
}