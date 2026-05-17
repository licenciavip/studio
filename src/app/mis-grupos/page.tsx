
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { groups } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MisGruposPage() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Pending'>('Active');

  // Filtrar grupos (en este MVP usamos los datos estáticos)
  const displayGroups = activeTab === 'Active' 
    ? groups.filter(g => g.status === 'Activo') 
    : groups.filter(g => g.status === 'Incompleto');

  return (
    <div className="max-w-lg mx-auto pb-12">
      {/* Screen Title */}
      <div className="mb-6 px-1">
        <h2 className="text-3xl font-sora font-bold text-on-surface">Mis Grupos</h2>
        <p className="text-muted-foreground font-inter">Gestiona tus suscripciones activas y pendientes</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex p-1 bg-surface-container rounded-2xl mb-8">
        <button 
          onClick={() => setActiveTab('Active')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200",
            activeTab === 'Active' 
              ? "bg-white text-primary shadow-sm" 
              : "text-muted-foreground hover:text-on-surface"
          )}
        >
          Activos
        </button>
        <button 
          onClick={() => setActiveTab('Pending')}
          className={cn(
            "flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200",
            activeTab === 'Pending' 
              ? "bg-white text-primary shadow-sm" 
              : "text-muted-foreground hover:text-on-surface"
          )}
        >
          Pendientes
        </button>
      </div>

      {/* Group List Container */}
      <div className="space-y-6">
        {displayGroups.length > 0 ? (
          displayGroups.map((group) => (
            <div 
              key={group.id} 
              className="glass-card p-6 rounded-3xl border border-outline-variant/30 shadow-[0_8px_30px_rgb(67,67,213,0.06)] hover:shadow-[0_8px_30px_rgb(67,67,213,0.12)] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/20">
                    <Image 
                      src={`https://picsum.photos/seed/${group.id}/100/100`} 
                      alt={group.service} 
                      width={32} 
                      height={32} 
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-sora font-bold text-lg text-on-surface">{group.service}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border",
                        group.id === '1' || group.id === '3' 
                          ? "bg-primary/10 text-primary border-primary/20" 
                          : "bg-secondary/10 text-secondary border-secondary/20"
                      )}>
                        {group.id === '1' || group.id === '3' ? 'Admin' : 'Miembro'}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">ID: #{group.id}00{group.id}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Cobro</p>
                  <p className="font-bold text-on-surface">24 Oct</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Capacidad</span>
                  <span className="text-primary">{group.slots.filled} / {group.slots.total} Cupos</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-secondary-fixed h-full rounded-full transition-all duration-700" 
                    style={{ width: `${(group.slots.filled / group.slots.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-muted">
                      <Image 
                        src={`https://picsum.photos/seed/user${group.id}${i}/100/100`} 
                        alt="Member" 
                        width={32} 
                        height={32} 
                      />
                    </div>
                  ))}
                  {group.slots.total - 3 > 0 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-primary">
                      +{group.slots.total - 3}
                    </div>
                  )}
                </div>
                <Button asChild variant="link" className="text-primary font-bold hover:no-underline p-0 flex items-center gap-1 group">
                  <Link href={`/mis-grupos/${group.id}`}>
                    {group.id === '1' || group.id === '3' ? 'Gestionar' : 'Ver Detalles'}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-surface-container/30 rounded-3xl border-2 border-dashed border-outline-variant/50">
            <p className="text-muted-foreground">No tienes grupos {activeTab === 'Active' ? 'activos' : 'pendientes'}.</p>
            <Button asChild variant="link" className="mt-2 text-primary font-bold">
              <Link href="/explorar">¡Únete a uno ahora!</Link>
            </Button>
          </div>
        )}
      </div>

      {/* FAB for adding groups */}
      <div className="fixed bottom-28 right-6 z-40">
        <Button asChild className="w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all p-0">
          <Link href="/compartir">
            <Plus className="h-8 w-8" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
