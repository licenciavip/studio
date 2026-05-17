
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/30 flex justify-between items-center w-full px-4 h-16 md:px-20">
      <div className="flex items-center gap-3">
        <Link href="/perfil" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary block active:scale-95 transition-transform">
          <Image 
            src="https://picsum.photos/seed/user123/100/100" 
            alt="user profile" 
            width={40} 
            height={40} 
            className="w-full h-full object-cover"
          />
        </Link>
        <span className="text-xl font-sora font-bold text-primary">Poolera</span>
      </div>
      
      <Button variant="ghost" size="icon" className="rounded-full">
        <span className="material-symbols-outlined text-primary">notifications</span>
      </Button>
    </header>
  );
}
