
'use client';

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Subscription } from "@/lib/types";
import { Star, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type SubscriptionCardProps = {
  subscription: Subscription;
};

export default function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  return (
    <div className="glass-card rounded-[2rem] overflow-hidden p-4 flex flex-col justify-between group hover:bg-white/50 transition-all duration-500 active:scale-[0.98] border-white/40">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-xl border border-primary/10 shadow-sm">
            <AvatarImage src={subscription.avatarUrl} alt={`Avatar de ${subscription.host}`} className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black">{subscription.host.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <h3 className="text-[12px] font-bold text-on-surface tracking-tight leading-none">
              {subscription.host}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
              <span className="text-[9px] font-bold text-on-surface-variant/40">{subscription.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/5 rounded-full px-2 py-0.5 border border-primary/10">
          <span className="text-[8px] font-black text-primary uppercase tracking-tighter">
            {subscription.availableSlots} CUPOS
          </span>
        </div>
      </div>
      
      <div className="mb-4 px-1">
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant/40">{subscription.currency}</span>
          <span className="text-2xl font-black text-on-surface tracking-tighter">{subscription.price.toFixed(2)}</span>
          <span className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest ml-1">/ mes</span>
        </div>
        <p className="text-[8px] font-medium text-on-surface-variant/40 mt-1 uppercase tracking-tighter">
          Validación BCP instantánea incluida
        </p>
      </div>

      <Link href={`/checkout/${subscription.id}`} className="block">
        <div className="w-full glass-button bg-primary text-white h-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-all">
          <Zap className="h-3 w-3" />
          Unirme
        </div>
      </Link>
    </div>
  );
}
