"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";

export default function Header() {
  const auth = useAuth();
  const user = auth?.currentUser;

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-margin-mobile h-16 border-b border-outline-variant/30 shadow-sm md:px-margin-desktop">
      <div className="flex items-center gap-3">
        <Link href="/perfil" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed block active:scale-95 transition-transform shadow-inner">
          <Image 
            src={user?.photoURL || "https://picsum.photos/seed/user123/100/100"} 
            alt="user profile" 
            width={40} 
            height={40} 
            className="w-full h-full object-cover"
          />
        </Link>
        <Link href="/">
          <span className="text-2xl font-sora font-extrabold text-primary tracking-tighter">SubShare</span>
        </Link>
      </div>
      
      <Button variant="ghost" size="icon" className="rounded-full bg-surface-container/50 hover:bg-surface-container transition-colors active:scale-95 duration-150">
        <span className="material-symbols-outlined text-primary">notifications</span>
      </Button>
    </header>
  );
}
