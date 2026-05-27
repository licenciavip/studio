"use client";

import Link from 'next/link';
import { orders } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, History, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn(
      "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
      {
        'bg-green-100 text-green-700': status === 'Activo',
        'bg-amber-100 text-amber-700': status === 'Pendiente',
        'bg-red-100 text-red-700': status === 'En disputa',
        'bg-gray-100 text-gray-500': status === 'Finalizado',
      }
    )}>
      {status}
    </span>
  );
}

export default function MisOrdenesPage() {
  return (
    <div className="container mx-auto max-w-xl pt-14 pb-24 px-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tighter">Historial</h1>
        <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Tus suscripciones pasadas</p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="glass-card p-4 rounded-[1.8rem] flex items-center justify-between hover:bg-white/50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface tracking-tight">{order.service}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-medium text-on-surface/40">Anfitrión: {order.host}</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold tracking-tight">${order.price.toFixed(2)}</p>
                <p className="text-[8px] font-black text-on-surface/30 uppercase tracking-widest">Exp: {order.expires}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <MoreHorizontal className="h-4 w-4 text-on-surface/30" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card rounded-xl border-white/50">
                  <DropdownMenuItem asChild>
                     <Link href={`/disputas/${order.id}`} className="text-xs font-bold">Abrir Disputa</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-16 glass-card rounded-[2rem] border-dashed border-primary/10">
            <p className="text-[10px] font-bold text-on-surface/30 uppercase tracking-[0.2em]">Sin historial de órdenes</p>
          </div>
        )}
      </div>
    </div>
  );
}