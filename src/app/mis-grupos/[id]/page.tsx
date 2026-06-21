"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Key, Copy, Eye, EyeOff, AlertCircle, Users, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import type { GroupDoc } from "@/lib/types";

export default function GroupDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const firestore = useFirestore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const groupRef = useMemo(
    () => (firestore ? doc(firestore, "groups", params.id) : null),
    [firestore, params.id]
  );
  const { data: group, loading } = useDoc<GroupDoc>(groupRef);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: `${label} copiado al portapapeles.` });
  };

  if (loading) {
    return <p className="pt-10 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface/30">Cargando…</p>;
  }
  if (!group) {
    return (
      <div className="pt-10 text-center space-y-3">
        <p className="text-sm text-on-surface/40">Grupo no encontrado</p>
        <Button asChild variant="link"><Link href="/mis-grupos">Volver a mis grupos</Link></Button>
      </div>
    );
  }

  const pct = group.slotsTotal > 0 ? (group.slotsFilled / group.slotsTotal) * 100 : 0;

  return (
    <div className="pb-24 pt-2 space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/40">
          <Link href="/mis-grupos"><ArrowLeft className="h-4 w-4 text-primary" /></Link>
        </Button>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-on-surface">{group.serviceName}</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Tu grupo · Anfitrión</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="relative overflow-hidden rounded-[2rem] p-6 text-white shadow-lg" style={{ background: group.serviceColor || "#4343d5" }}>
        <div className="absolute -right-6 -top-6 opacity-10"><Sparkles className="h-28 w-28" /></div>
        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Tus ganancias</p>
            <h2 className="text-4xl font-extrabold tracking-tighter">S/{group.hostEarning.toFixed(2)}<span className="text-sm font-medium opacity-70">/mes</span></h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="opacity-70 uppercase tracking-wide flex items-center gap-1"><Users className="h-3 w-3" /> Capacidad</span>
              <span>{group.slotsFilled}/{group.slotsTotal} cupos</span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Credenciales */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-extrabold text-on-surface">
          <Key className="h-4 w-4 text-primary" /> Credenciales de acceso
        </h3>
        <div className="glass-card rounded-[1.8rem] p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email del grupo</Label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/30 px-3 py-2.5">
              <Mail className="h-4 w-4 text-on-surface-variant" />
              <span className="flex-1 truncate text-sm font-bold text-on-surface">{group.credentials.email}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => handleCopy(group.credentials.email, "Email")}><Copy className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="ml-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Contraseña</Label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/30 px-3 py-2.5">
              <Key className="h-4 w-4 text-on-surface-variant" />
              <span className="flex-1 truncate text-sm font-bold tracking-wider text-on-surface">{showPassword ? group.credentials.pass : "••••••••"}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-on-surface-variant" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => handleCopy(group.credentials.pass, "Contraseña")}><Copy className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 p-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-[11px] font-medium text-primary">Como anfitrión, mantén estas credenciales actualizadas. Si las cambias en el servicio, actualízalas aquí.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
