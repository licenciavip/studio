"use client";

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser, useDoc } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { logAdminAction } from "@/lib/admin-log";
import { PageHeader, AdminCard, EmptyState } from "@/components/admin/admin-ui";
import type { GroupDoc } from "@/lib/types";

const approvalBadge: Record<GroupDoc["approval"], { label: string; cls: string }> = {
  pending: { label: "En revisión", cls: "bg-warning/15 text-warning" },
  approved: { label: "Aprobado", cls: "bg-success/15 text-success" },
  rejected: { label: "Rechazado", cls: "bg-danger/15 text-danger" },
};

export default function AdminSuscripcionesPage() {
  const firestore = useFirestore();
  const { user, isAdmin } = useUser();
  const { toast } = useToast();

  const [selected, setSelected] = useState<GroupDoc | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const groupsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "groups"), orderBy("updatedAt", "desc"));
  }, [firestore]);

  const { data: groups, loading } = useCollection<GroupDoc>(groupsQuery);
  const credentialsRef = useMemo(
    () => (firestore && selected ? doc(firestore, "groups", selected.id, "private", "credentials") : null),
    [firestore, selected]
  );
  const { data: credentials } = useDoc<{ email: string; pass: string }>(credentialsRef);

  const ensureAdmin = () => {
    if (!firestore || !user || !isAdmin) { toast({ title: "No autorizado", variant: "destructive" }); return false; }
    return true;
  };

  const handleApprove = async (g: GroupDoc) => {
    if (!ensureAdmin() || !firestore || !user) return;
    setProcessing(true);
    try {
      await updateDoc(doc(firestore, "groups", g.id), {
        approval: "approved", status: "Activo", reviewedBy: user.uid, reviewedAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, "group_approved", { targetUserId: g.hostId, resourceId: g.id, details: { service: g.serviceName } });
      toast({ title: "Grupo aprobado" });
      setSelected(null);
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setProcessing(false); }
  };

  const handleReject = async () => {
    if (!ensureAdmin() || !selected || !firestore || !user) return;
    setProcessing(true);
    try {
      await updateDoc(doc(firestore, "groups", selected.id), {
        approval: "rejected", rejectedReason: reason, reviewedBy: user.uid, reviewedAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, "group_rejected", { targetUserId: selected.hostId, resourceId: selected.id, details: { service: selected.serviceName, reason } });
      toast({ title: "Grupo rechazado" });
      setShowReject(false); setSelected(null); setReason("");
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setProcessing(false); }
  };

  const pending = (groups ?? []).filter((g) => g.approval === "pending");

  return (
    <div>
      <PageHeader title="Suscripciones" description="Aprueba o rechaza los grupos publicados." />

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando…</p>}
      {!loading && (groups?.length ?? 0) === 0 && (
        <EmptyState title="Sin grupos" description="Cuando los usuarios publiquen suscripciones aparecerán aquí para revisión." />
      )}

      {pending.length > 0 && (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-warning">{pending.length} por revisar</p>
      )}

      <div className="space-y-2">
        {groups?.map((g) => {
          const badge = approvalBadge[g.approval];
          return (
            <AdminCard key={g.id} className="flex items-center justify-between">
              <button className="flex flex-1 items-center justify-between text-left" onClick={() => setSelected(g)}>
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 rounded-xl shrink-0" style={{ background: g.serviceColor || "#4343d5" }} />
                  <div>
                    <p className="text-sm font-bold text-white">{g.serviceName}</p>
                    <p className="text-[11px] text-white/40">por {g.hostName} · {g.slotsTotal} cupos · S/{g.pricePerSlot.toFixed(2)}</p>
                  </div>
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest", badge.cls)}>{badge.label}</span>
              </button>
            </AdminCard>
          );
        })}
      </div>

      <Dialog open={!!selected && !showReject} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">{selected?.serviceName}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1 text-sm">
              <p><span className="text-white/40">Anfitrión:</span> {selected?.hostName}</p>
              <p><span className="text-white/40">Cupos ofrecidos:</span> {selected?.slotsTotal}</p>
              <p><span className="text-white/40">Precio/cupo:</span> S/{selected?.pricePerSlot.toFixed(2)}</p>
              <p><span className="text-white/40">Ganancia anfitrión:</span> S/{selected?.hostEarning.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1 text-sm">
              <p className="text-[9px] font-black uppercase text-white/40">Credenciales (verificación)</p>
              <p><span className="text-white/40">Email:</span> <span className="font-mono">{credentials?.email ?? "No disponible"}</span></p>
              <p><span className="text-white/40">Pass:</span> <span className="font-mono">{credentials?.pass ?? "No disponible"}</span></p>
            </div>
          </div>
          {selected?.approval === "pending" && (
            <DialogFooter className="flex gap-2">
              <Button variant="outline" className="h-11 flex-1 rounded-xl border-danger/30 bg-transparent font-bold text-danger hover:bg-danger/10" onClick={() => setShowReject(true)} disabled={processing}>Rechazar</Button>
              <Button className="h-11 flex-1 rounded-xl bg-success font-bold text-white hover:bg-success/90" onClick={() => selected && handleApprove(selected)} disabled={processing}>Aprobar</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="max-w-sm rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">Rechazar grupo</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Motivo</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ej: las credenciales no son válidas…" className="rounded-xl border-white/10 bg-white/[0.03] text-sm text-white" />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" className="h-11 flex-1 rounded-xl border-white/15 bg-transparent font-bold text-white hover:bg-white/10" onClick={() => setShowReject(false)} disabled={processing}>Cancelar</Button>
            <Button className="h-11 flex-1 rounded-xl bg-danger font-bold text-white hover:bg-danger/90" onClick={handleReject} disabled={processing || !reason.trim()}>Rechazar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
