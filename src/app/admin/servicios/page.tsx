"use client";

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { logAdminAction } from "@/lib/admin-log";
import { PageHeader, AdminCard, EmptyState } from "@/components/admin/admin-ui";
import type { ServiceDoc } from "@/lib/types";

export default function AdminServiciosPage() {
  const firestore = useFirestore();
  const { user, isAdmin } = useUser();
  const { toast } = useToast();

  const [selected, setSelected] = useState<ServiceDoc | null>(null);
  const [maxSlots, setMaxSlots] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const servicesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "services"), orderBy("name"));
  }, [firestore]);

  const { data: services, loading } = useCollection<ServiceDoc>(servicesQuery);

  const openEdit = (s: ServiceDoc) => {
    setSelected(s);
    setMaxSlots(String(s.maxSlots ?? 5));
    setPrice(String(s.pricePerMonth ?? 0));
    setActive(s.active !== false);
  };

  const handleSave = async () => {
    if (!firestore || !user || !isAdmin || !selected) { toast({ title: "No autorizado", variant: "destructive" }); return; }
    const ms = parseInt(maxSlots, 10);
    if (!ms || ms < 2) { toast({ title: "Cupos inválidos", description: "Debe ser al menos 2 (dueño + 1).", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await updateDoc(doc(firestore, "services", selected.id), {
        maxSlots: ms,
        pricePerMonth: parseFloat(price) || 0,
        active,
        updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, "service_updated", { resourceId: selected.id, details: { maxSlots: ms, pricePerMonth: parseFloat(price) || 0, active } });
      toast({ title: "Servicio actualizado" });
      setSelected(null);
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader title="Servicios" description="Ajusta el precio y los cupos máximos por cuenta de cada servicio." />

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando…</p>}
      {!loading && (services?.length ?? 0) === 0 && (
        <EmptyState title="Sin servicios" description="Aún no hay catálogo en Firestore. Ejecuta el script de carga inicial (scripts/seed-services.mjs)." />
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {services?.map((s) => (
          <AdminCard key={s.id} className="flex items-center justify-between">
            <button className="flex flex-1 items-center justify-between text-left" onClick={() => openEdit(s)}>
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-lg shrink-0" style={{ background: s.color || "#4343d5" }} />
                <div>
                  <p className="text-sm font-bold text-white">{s.name} {s.active === false && <span className="text-[9px] text-white/30">(inactivo)</span>}</p>
                  <p className="text-[11px] text-white/40">Máx {s.maxSlots} asientos · comparte {Math.max(1, s.maxSlots - 1)}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-white">S/{Number(s.pricePerMonth).toFixed(2)}</p>
            </button>
          </AdminCard>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-sm rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">{selected?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Asientos máximos por cuenta</Label>
              <input type="number" value={maxSlots} onChange={(e) => setMaxSlots(e.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white outline-none" />
              <p className="text-[10px] text-white/35">Compartibles = este número − 1 (el dueño usa un asiento).</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Precio referencial / mes (S/)</Label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white outline-none" />
            </div>
            <button onClick={() => setActive(!active)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="text-sm font-bold">Activo en el catálogo</span>
              <span className={cn("relative h-5 w-9 rounded-full transition-colors", active ? "bg-success" : "bg-white/20")}>
                <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all", active ? "left-[1.15rem]" : "left-0.5")} />
              </span>
            </button>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" className="h-11 flex-1 rounded-xl border-white/15 bg-transparent font-bold text-white hover:bg-white/10" onClick={() => setSelected(null)} disabled={saving}>Cancelar</Button>
            <Button className="h-11 flex-1 rounded-xl bg-primary font-bold text-white hover:bg-primary/90" onClick={handleSave} disabled={saving}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
