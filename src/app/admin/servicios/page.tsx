"use client";

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
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
  const [fee, setFee] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  // Crear
  const [showCreate, setShowCreate] = useState(false);
  const [cName, setCName] = useState("");
  const [cPlan, setCPlan] = useState("");
  const [cCategory, setCCategory] = useState("ia");
  const [cColor, setCColor] = useState("#4343d5");
  const [cPrice, setCPrice] = useState("");
  const [cFee, setCFee] = useState("");
  const [cMax, setCMax] = useState("5");

  const servicesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "services"), orderBy("name"));
  }, [firestore]);

  const { data: services, loading } = useCollection<ServiceDoc>(servicesQuery);

  const openEdit = (s: ServiceDoc) => {
    setSelected(s);
    setMaxSlots(String(s.maxSlots ?? 5));
    setPrice(String(s.pricePerMonth ?? 0));
    setFee(String(s.platformFee ?? 0));
    setActive(s.active !== false);
  };

  const priceN = parseFloat(price) || 0;
  const feeN = parseFloat(fee) || 0;
  const hostPerSlot = Math.max(0, priceN - feeN);

  const ensureAdmin = () => {
    if (!firestore || !user || !isAdmin) { toast({ title: "No autorizado", variant: "destructive" }); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!ensureAdmin() || !firestore || !user || !selected) return;
    const ms = parseInt(maxSlots, 10);
    if (!ms || ms < 2) { toast({ title: "Cupos inválidos", description: "Debe ser al menos 2 (dueño + 1).", variant: "destructive" }); return; }
    if (feeN > priceN) { toast({ title: "Comisión inválida", description: "No puede ser mayor que el precio.", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await updateDoc(doc(firestore, "services", selected.id), {
        maxSlots: ms, pricePerMonth: priceN, platformFee: feeN, hostEarnings: hostPerSlot, active, updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, "service_updated", { resourceId: selected.id, details: { maxSlots: ms, pricePerMonth: priceN, platformFee: feeN } });
      toast({ title: "Servicio actualizado" });
      setSelected(null);
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSaving(false); }
  };

  const handleCreate = async () => {
    if (!ensureAdmin() || !firestore || !user) return;
    const ms = parseInt(cMax, 10);
    const p = parseFloat(cPrice) || 0;
    const f = parseFloat(cFee) || 0;
    if (!cName.trim()) { toast({ title: "Falta el nombre", variant: "destructive" }); return; }
    if (!ms || ms < 2) { toast({ title: "Cupos inválidos", description: "Mínimo 2.", variant: "destructive" }); return; }
    if (f > p) { toast({ title: "Comisión inválida", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const id = doc(collection(firestore, "services")).id;
      await setDoc(doc(firestore, "services", id), {
        id, name: cName.trim(), planName: cPlan.trim() || cName.trim(), category: cCategory.trim() || "ia",
        color: cColor, pricePerMonth: p, platformFee: f, hostEarnings: Math.max(0, p - f), maxSlots: ms, active: true,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, "service_created", { resourceId: id, details: { name: cName.trim() } });
      toast({ title: "Servicio creado" });
      setShowCreate(false);
      setCName(""); setCPlan(""); setCColor("#4343d5"); setCPrice(""); setCFee(""); setCMax("5");
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <PageHeader title="Servicios" description="Precio, comisión de Poolera y cupos por cuenta." />
        <Button className="h-9 shrink-0 rounded-xl bg-primary text-[12px] font-bold text-white hover:bg-primary/90" onClick={() => setShowCreate(true)}>
          <Plus className="mr-1 h-4 w-4" /> Nuevo
        </Button>
      </div>

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando…</p>}
      {!loading && (services?.length ?? 0) === 0 && (
        <EmptyState title="Sin servicios" description="Crea uno con el botón Nuevo o ejecuta el seed inicial." />
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {services?.map((s) => {
          const host = Math.max(0, (s.pricePerMonth ?? 0) - (s.platformFee ?? 0));
          return (
            <AdminCard key={s.id} className="cursor-pointer transition-colors hover:bg-white/[0.06]">
              <button className="w-full text-left" onClick={() => openEdit(s)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-lg shrink-0" style={{ background: s.color || "#4343d5" }} />
                    <div>
                      <p className="text-sm font-bold text-white">{s.name} {s.active === false && <span className="text-[9px] text-white/30">(inactivo)</span>}</p>
                      <p className="text-[11px] text-white/40">Máx {s.maxSlots} · comparte {Math.max(1, s.maxSlots - 1)}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-white">S/{Number(s.pricePerMonth).toFixed(2)}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-success/10 px-2 py-1.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-success/70">Gana Poolera</p>
                    <p className="text-sm font-bold text-success">S/{Number(s.platformFee ?? 0).toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] px-2 py-1.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Recibe anfitrión</p>
                    <p className="text-sm font-bold text-white">S/{host.toFixed(2)}</p>
                  </div>
                </div>
              </button>
            </AdminCard>
          );
        })}
      </div>

      {/* Editar */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-sm rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">{selected?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Precio por cupo / mes (S/)</Label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white outline-none" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-success">Ganancia Poolera por cupo (S/)</Label>
              <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} className="h-11 w-full rounded-xl border border-success/30 bg-success/5 px-4 text-sm font-bold text-white outline-none" />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-white/50">El anfitrión recibe por cupo</span>
              <span className="text-base font-extrabold text-white">S/{hostPerSlot.toFixed(2)}</span>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Asientos máximos por cuenta</Label>
              <input type="number" value={maxSlots} onChange={(e) => setMaxSlots(e.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white outline-none" />
              <p className="text-[10px] text-white/35">Compartibles = este número − 1.</p>
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

      {/* Crear */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">Nuevo servicio</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Nombre</Label><input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Ej: Spotify" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-bold text-white outline-none" /></div>
              <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Plan</Label><input value={cPlan} onChange={(e) => setCPlan(e.target.value)} placeholder="Premium" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-bold text-white outline-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Categoría</Label><input value={cCategory} onChange={(e) => setCCategory(e.target.value)} placeholder="ia" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-bold text-white outline-none" /></div>
              <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Color</Label><input type="color" value={cColor} onChange={(e) => setCColor(e.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-1" /></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Precio</Label><input type="number" value={cPrice} onChange={(e) => setCPrice(e.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-bold text-white outline-none" /></div>
              <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-success">Comisión</Label><input type="number" value={cFee} onChange={(e) => setCFee(e.target.value)} className="h-11 w-full rounded-xl border border-success/30 bg-success/5 px-3 text-sm font-bold text-white outline-none" /></div>
              <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Máx</Label><input type="number" value={cMax} onChange={(e) => setCMax(e.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-bold text-white outline-none" /></div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" className="h-11 flex-1 rounded-xl border-white/15 bg-transparent font-bold text-white hover:bg-white/10" onClick={() => setShowCreate(false)} disabled={saving}>Cancelar</Button>
            <Button className="h-11 flex-1 rounded-xl bg-primary font-bold text-white hover:bg-primary/90" onClick={handleCreate} disabled={saving}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
