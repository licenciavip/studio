"use client";

import Link from "next/link";
import { useAuth } from "@/firebase";
import { Share2 } from "lucide-react";

export default function Header() {
  const auth = useAuth();
  const user = auth?.currentUser;

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 h-14 border-b border-outline-variant/30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
          <Share2 className="h-5 w-5 text-white" />
        </div>
        <Link href="/">
          <span className="text-xl font-sora font-bold text-on-surface tracking-tighter">SubShare</span>
        </Link>
      </div>
      
      <Link href="/perfil" className="w-9 h-9 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full transition-colors active:scale-95">
        <span className="material-symbols-outlined text-[24px]">account_circle</span>
      </Link>
    </header>
  );
}
