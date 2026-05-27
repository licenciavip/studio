"use client";

import Link from "next/link";
import { useAuth } from "@/firebase";
import { Share2 } from "lucide-react";

export default function Header() {
  const auth = useAuth();
  const user = auth?.currentUser;

  return (
    <header className="fixed top-0 left-0 right-0 z-[150] px-6 pt-6">
      <div className="max-w-2xl mx-auto flex justify-between items-center h-14 bg-white/20 backdrop-blur-2xl border border-white/10 rounded-[1.8rem] px-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/90 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/10 transition-transform active:scale-95">
            <Share2 className="h-4 w-4 text-white" />
          </div>
          <Link href="/">
            <span className="text-lg font-bold text-on-surface tracking-tighter">SubShare</span>
          </Link>
        </div>
        
        <Link href="/perfil" className="w-9 h-9 flex items-center justify-center text-on-surface-variant/60 hover:text-primary transition-all active:scale-90">
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
        </Link>
      </div>
    </header>
  );
}
