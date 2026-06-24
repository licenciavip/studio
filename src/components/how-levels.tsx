"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LevelBadge } from "@/components/level-badge";
import { POINT_RULES, TIERS } from "@/lib/levels";
import { HelpCircle } from "lucide-react";

/** Botón "¿Cómo funciona?" que abre la explicación de niveles. */
export function HowLevelsButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className={`inline-flex items-center gap-1 text-[11px] font-bold text-primary ${className}`}>
        <HelpCircle className="h-3.5 w-3.5" /> ¿Cómo funciona?
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card max-w-[340px] rounded-[2rem] border-white/30 p-6">
          <DialogHeader><DialogTitle className="text-center text-sm font-bold">¿Cómo subes de nivel?</DialogTitle></DialogHeader>

          <p className="py-2 text-center text-[11px] text-on-surface/50">
            Ganas puntos por tu actividad y confianza como anfitrión. Mientras más puntos, mayor tu nivel.
          </p>

          {/* Reglas de puntos */}
          <div className="space-y-1.5">
            {POINT_RULES.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-xl bg-white/20 px-3 py-2">
                <span className="text-[11px] font-medium text-on-surface/70">{r.label}</span>
                <span className="text-[12px] font-black text-success">{r.points}</span>
              </div>
            ))}
          </div>

          {/* Escalera de niveles */}
          <p className="mt-4 mb-2 text-[10px] font-black uppercase tracking-widest text-on-surface/40">Niveles</p>
          <div className="space-y-1.5">
            {TIERS.map((t) => (
              <div key={t.key} className="flex items-center justify-between">
                <LevelBadge tierKey={t.key} size="sm" />
                <span className="text-[10px] font-bold text-on-surface/40">{t.min}+ pts</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
