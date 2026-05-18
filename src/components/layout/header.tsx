"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";

export default function Header() {
  const auth = useAuth();
  const user = auth?.currentUser;

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 h-16 border-b border-outline-variant/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
          <span className="material-symbols-outlined text-[24px]">joining_queries</span>
        </div>
        <Link href="/">
          <span className="text-2xl font-sora font-bold text-on-surface tracking-tighter">SubShare</span>
        </Link>
      </div>
      
      <Link href="/perfil" className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-full transition-colors active:scale-95">
        <span className="material-symbols-outlined text-[28px]">person</span>
      </Link>
    </header>
  );
}
