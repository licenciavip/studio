"use client";

import Link from "next/link";
import { useAuth } from "@/firebase";
import { Share2 } from "lucide-react";

export default function Header() {
  const auth = useAuth();
  const user = auth?.currentUser;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4">
      <div className="max-w-2xl mx-auto flex justify-between items-center h-14 bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl px-5 shadow-lg shadow-black/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <Link href="/">
            <span className="text-xl font-sora font-bold text-on-surface tracking-tighter">SubShare</span>
          </Link>
        </div>
        
        <Link href="/perfil" className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90">
          <span className="material-symbols-outlined text-[24px]">account_circle</span>
        </Link>
      </div>
    </header>
  );
}
