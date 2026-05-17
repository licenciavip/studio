"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";

export default function Header() {
  const auth = useAuth();
  const user = auth?.currentUser;

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-4 h-16 border-b border-outline-variant/30 shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/perfil" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed block active:scale-95 transition-transform shadow-sm relative">
          <Image 
            src={user?.photoURL || "https://picsum.photos/seed/user123/100/100"} 
            alt="user profile picture" 
            fill
            className="object-cover"
          />
        </Link>
        <Link href="/">
          <span className="text-xl font-sora font-bold text-primary tracking-tighter">SubShare</span>
        </Link>
      </div>
      
      <Button variant="ghost" size="icon" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-150 text-primary">
        <span className="material-symbols-outlined">notifications</span>
      </Button>
    </header>
  );
}
