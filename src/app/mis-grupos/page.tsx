
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { groups } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ChevronRight, LayoutGrid, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MisGruposPage() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Pending'>('Active');

  const displayGroups = activeTab === 'Active' 
    ? groups.filter(g => g.status === 'Activo') 
    : groups.filter(g => g.status === 'Incompleto');

  return (
    <div className="max-w-xl mx-auto pt-10 pb-32 px-4 space-y-6">
      <div className="px-1 space-y-0.5">
        <h2 className="text-xl font-extrabold text-on-surface tracking-tight">Mis Grupos</h2>
        <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Gestiona tus suscripciones</p>
      </div>

      {/* Segmented Control - Ultra Compact Apple Style */}
      <div className="p-1 bg-white/30 backdrop-blur-3xl border border-white/40 rounded-2xl flex shadow-sm">
        <button 
          onClick={() => setActiveTab('Active')}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2",
            activeTab === 'Active' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant/40"
          )}
        >
          <LayoutGrid className="h-3 w-3" /> Activos
        </button>
        <button 
          onClick={() => setActiveTab('Pending')}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2",
            activeTab === 'Pending' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant/40"
          )}
        >
          <Clock className="h-3 w-3" /> Pendientes
        </button>
      </div>

      <div className="space-y-2">
        {displayGroups.length > 0 ? (
          <div className="glass-card rounded-[2rem] overflow-hidden divide-y divide-white/10">
            {displayGroups.map((group) => (
              <Link 
                href={`/mis-grupos/${group.id}`} 
                key={group.id} 
                className="flex items-center justify-between p-4 hover:bg-white/40 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center overflow-hidden border border-white/60 shadow-sm shrink-0">
                    <Image 
                      src={`https://picsum.photos/seed/${group.id}/100/100`} 
                      alt={group.service} 
                      width={24} 
                      height={24} 
                      className="object-contain" 
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-on-surface tracking-tight">{group.service}</h3>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border",
                        group.userRole === 'Anfitrión' ? "bg-primary/10 text-primary border-primary/10" : "bg-secondary/10 text-secondary border-secondary/10"
                      )}>
                        {group.userRole}
                      </span>
                      <div className="flex items-center gap-1 text-[8px] font-bold text-on-surface-variant/40 uppercase">
                        <Users className="h-2.5 w-2.5" />
                        {group.slots.filled}/{group.slots.total}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-on-surface-variant/30 uppercase tracking-widest">PRÓXIMO</p>
                    <p className="text-[11px] font-bold text-on-surface">{group.nextBill}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-on-surface-variant/20 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-[2.5rem] border-dashed border-primary/10">
            <p className="text-on-surface-variant/40 text-[10px] font-black uppercase tracking-widest">Sin grupos {activeTab === 'Active' ? 'activos' : 'pendientes'}</p>
            <Button asChild variant="link" className="mt-2 text-primary text-[11px] font-bold uppercase tracking-tight">
              <Link href="/">Explorar servicios</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Tip Premium style */}
      <div className="glass-card p-4 rounded-3xl border-primary/5 bg-primary/5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Clock className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-primary uppercase tracking-tight">Recordatorio</p>
          <p className="text-[11px] font-medium text-on-surface-variant/70 leading-relaxed">
            Las renovaciones se procesan automáticamente 24h antes de la fecha de cobro.
          </p>
        </div>
      </div>
    </div>
  );
}
