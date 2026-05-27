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
    <div className="max-w-xl mx-auto pt-20 pb-32 px-4 space-y-8">
      {/* Screen Title */}
      <div className="px-2 space-y-1">
        <h2 className="text-3xl font-sora font-extrabold text-on-surface">Mis Grupos</h2>
        <p className="text-sm font-medium text-on-surface-variant/60 tracking-tight">Gestiona tus servicios activos</p>
      </div>

      {/* Segmented Control - Apple Style */}
      <div className="p-1.5 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-lg shadow-black/5 flex">
        <button 
          onClick={() => setActiveTab('Active')}
          className={cn(
            "flex-1 py-3 text-sm font-bold rounded-[1.5rem] transition-all duration-300 flex items-center justify-center gap-2",
            activeTab === 'Active' 
              ? "bg-white text-primary shadow-xl shadow-primary/5" 
              : "text-on-surface-variant/60 hover:text-on-surface"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Activos
        </button>
        <button 
          onClick={() => setActiveTab('Pending')}
          className={cn(
            "flex-1 py-3 text-sm font-bold rounded-[1.5rem] transition-all duration-300 flex items-center justify-center gap-2",
            activeTab === 'Pending' 
              ? "bg-white text-primary shadow-xl shadow-primary/5" 
              : "text-on-surface-variant/60 hover:text-on-surface"
          )}
        >
          <Clock className="h-4 w-4" />
          Pendientes
        </button>
      </div>

      {/* Group List */}
      <div className="space-y-6">
        {displayGroups.length > 0 ? (
          displayGroups.map((group) => (
            <div 
              key={group.id} 
              className="glass-card p-6 rounded-[2.5rem] hover:bg-white/60 transition-all duration-500 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-[1.2rem] bg-surface-container-high flex items-center justify-center overflow-hidden border border-white/40 shadow-inner">
                    <Image 
                      src={`https://picsum.photos/seed/${group.id}/200/200`} 
                      alt={group.service} 
                      width={38} 
                      height={38} 
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-sora font-extrabold text-lg text-on-surface tracking-tight">{group.service}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[10px] uppercase tracking-[0.1em] font-black px-3 py-1 rounded-full border",
                        group.userRole === 'Anfitrión'
                          ? "bg-primary/10 text-primary border-primary/10" 
                          : "bg-secondary/10 text-secondary border-secondary/10"
                      )}>
                        {group.userRole}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Cobro</p>
                  <p className="font-bold text-on-surface">{group.nextBill}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-variant/60">Cupos vendidos</span>
                  <span className="text-primary">{group.slots.filled} de {group.slots.total}</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden border border-white/20">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(67,67,213,0.3)]" 
                    style={{ width: `${(group.slots.filled / group.slots.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/40 flex justify-between items-center">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-muted shadow-md ring-2 ring-white/10 relative">
                      <Image 
                        src={`https://picsum.photos/seed/user${group.id}${i}/100/100`} 
                        alt="Member" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {group.slots.total - 3 > 0 && (
                    <div className="w-9 h-9 rounded-full border-2 border-white bg-surface-container flex items-center justify-center text-[11px] font-black text-on-surface-variant shadow-md">
                      +{group.slots.total - 3}
                    </div>
                  )}
                </div>
                <Button asChild variant="link" className="text-primary font-bold hover:no-underline p-0 flex items-center gap-1 group">
                  <Link href={`/mis-grupos/${group.id}`}>
                    {group.userRole === 'Anfitrión' ? 'Gestionar' : 'Ver Detalles'}
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 glass-card rounded-[3rem] border-dashed border-primary/20 bg-white/20">
            <p className="text-on-surface-variant/60 font-medium">No tienes grupos {activeTab === 'Active' ? 'activos' : 'pendientes'}.</p>
            <Button asChild variant="link" className="mt-4 text-primary font-extrabold text-lg">
              <Link href="/">¡Únete a uno ahora!</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
