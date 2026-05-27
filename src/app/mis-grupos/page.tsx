"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { groups } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ChevronRight, LayoutGrid, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MisGruposPage() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Pending'>('Active');

  const displayGroups = activeTab === 'Active' 
    ? groups.filter(g => g.status === 'Activo') 
    : groups.filter(g => g.status === 'Incompleto');

  return (
    <div className="max-w-xl mx-auto pt-12 pb-32 px-4 space-y-6">
      <div className="px-1 space-y-0.5">
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Mis Grupos</h2>
        <p className="text-xs font-medium text-on-surface-variant/60 tracking-tight">Gestiona tus servicios activos</p>
      </div>

      {/* Segmented Control - Apple Style */}
      <div className="p-1 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl flex">
        <button 
          onClick={() => setActiveTab('Active')}
          className={cn(
            "flex-1 py-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
            activeTab === 'Active' ? "glass-card bg-white text-primary shadow-sm" : "text-on-surface-variant/60"
          )}
        >
          <LayoutGrid className="h-3.5 w-3.5" /> Activos
        </button>
        <button 
          onClick={() => setActiveTab('Pending')}
          className={cn(
            "flex-1 py-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
            activeTab === 'Pending' ? "glass-card bg-white text-primary shadow-sm" : "text-on-surface-variant/60"
          )}
        >
          <Clock className="h-3.5 w-3.5" /> Pendientes
        </button>
      </div>

      <div className="space-y-4">
        {displayGroups.length > 0 ? (
          displayGroups.map((group) => (
            <div key={group.id} className="glass-card p-5 rounded-[2rem] hover:bg-white/60 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden border border-white/40">
                    <Image src={`https://picsum.photos/seed/${group.id}/200/200`} alt={group.service} width={32} height={32} className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface tracking-tight">{group.service}</h3>
                    <span className={cn(
                      "text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full border",
                      group.userRole === 'Anfitrión' ? "bg-primary/10 text-primary border-primary/10" : "bg-secondary/10 text-secondary border-secondary/10"
                    )}>
                      {group.userRole}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-on-surface-variant/30 uppercase tracking-widest">Cobro</p>
                  <p className="text-xs font-bold text-on-surface">{group.nextBill}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-on-surface-variant/50">Cupos vendidos</span>
                  <span className="text-primary">{group.slots.filled} de {group.slots.total}</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${(group.slots.filled / group.slots.total) * 100}%` }}></div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/40 flex justify-between items-center">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-muted shadow-sm">
                      <Image src={`https://picsum.photos/seed/user${group.id}${i}/100/100`} alt="Member" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <Button asChild variant="link" className="text-primary font-bold text-xs p-0 group">
                  <Link href={`/mis-grupos/${group.id}`} className="flex items-center gap-1">
                    {group.userRole === 'Anfitrión' ? 'Gestionar' : 'Ver Detalles'}
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-all" />
                  </Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 glass-card rounded-[2.5rem] border-dashed border-primary/10">
            <p className="text-on-surface-variant/40 text-xs font-medium">No tienes grupos {activeTab === 'Active' ? 'activos' : 'pendientes'}.</p>
            <Button asChild variant="link" className="mt-2 text-primary font-bold">
              <Link href="/">Explorar servicios</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}