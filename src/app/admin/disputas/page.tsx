"use client";

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import {
  collection, query, orderBy, doc, getDoc, setDoc, updateDoc, serverTimestamp, increment,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { logAdminAction } from "@/lib/admin-log";
import { PageHeader, AdminCard, EmptyState } from "@/components/admin/admin-ui";
import type { Dispute } from "@/lib/types";

const statusBadge: Record<Dispute["status"], { label: string; cls: string }> = {
  open: { label: "Abierta", cls: "bg-warning/15 text-warning" },
  resolved: { label: "Resuelta", cls: "bg-success/15 text-success" },
  rejected: { label: "Rechazada", cls: "bg-danger/15 text-danger" },
};

export default function AdminDisputasPage() {
  const firestore = useFirestore();
  const { user, isAdmin } = useUser();
  const { toast } = useToast();

  const [selected, setSelected] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState("");
  const [refund, setRefund] = useState("");
  const [processing, setProcessing] = useState(false);

  const disputesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "disputes"), orderBy("updatedAt", "desc"));
  }, [firestore]);

  const { data: disputes, loading } = useCollection<Dispute>(disputesQuery);

  const ensureAdmin = (): boolean => {
    if (!firestore || !user || !isAdmin) {
      toast({ title: "No autorizado", variant: "destructive" });
      return false;
    }
    return true;
  };

  const close = () => { setSelected(null); setResolution(""); setRefund(""); };

  const handleResolve = async () => {
    if (!ensureAdmin() || !selected || !firestore || !user) return;
    const refundAmount = parseFloat(refund) || 0;
    setProcessing(true);
    try {
      if (refundAmount > 0) {
        const walletRef = doc(firestore, "wallets", selected.userId);
        const snap = await getDoc(walletRef);
        if (snap.exists()) {
          await updateDoc(walletRef, { balance: increment(refundAmount), updatedAt: serverTimestamp() });
        } else {
          await setDoc(walletRef, { userId: selected.userId, balance: refundAmount, currency: "PEN", updatedAt: serverTimestamp() });
        }
      }
      await updateDoc(doc(firestore, "disputes", selected.id), {
        status: "resolved",
        resolution: resolution.trim() || null,
        refundAmount,
        reviewedBy: user.uid,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, "dispute_resolved", {
        targetUserId: selected.userId,
        resourceId: selected.id,
        details: { orderId: selected.orderId, refundAmount, resolution: resolution.trim() },
      });
      toast({ title: "Disputa resuelta" });
      close();
    } catch {
      toast({ title: "Error", description: "No se pudo resolver la disputa.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!ensureAdmin() || !selected || !firestore || !user) return;
    setProcessing(true);
    try {
      await updateDoc(doc(firestore, "disputes", selected.id), {
        status: "rejected",
        resolution: resolution.trim() || null,
        reviewedBy: user.uid,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, "dispute_rejected", {
        targetUserId: selected.userId,
        resourceId: selected.id,
        details: { orderId: selected.orderId, reason: resolution.trim() },
      });
      toast({ title: "Disputa rechazada" });
      close();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <PageHeader title="Disputas" description="Reclamos abiertos por los usuarios sobre sus órdenes." />

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando…</p>}
      {!loading && (disputes?.length ?? 0) === 0 && (
        <EmptyState title="Sin disputas" description="Los reclamos aparecerán aquí." />
      )}

      <div className="space-y-2">
        {disputes?.map((d) => {
          const badge = statusBadge[d.status];
          return (
            <AdminCard key={d.id} className="flex items-center justify-between">
              <button className="flex flex-1 items-center justify-between text-left" onClick={() => setSelected(d)}>
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-bold text-white">Orden {d.orderId}</p>
                  <p className="truncate text-[11px] text-white/40">{d.evidence}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest", badge.cls)}>
                  {badge.label}
                </span>
              </button>
            </AdminCard>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={() => close()}>
        <DialogContent className="max-w-lg rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">Disputa · Orden {selected?.orderId}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[9px] font-black uppercase text-white/40">Evidencia del usuario</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-white/90">{selected?.evidence}</p>
            </div>

            {selected?.status === "open" ? (
              <>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Resolución / motivo</Label>
                  <Textarea value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Explica la decisión…" className="rounded-xl border-white/10 bg-white/[0.03] text-sm text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Reembolso a acreditar (S/) — opcional</Label>
                  <input type="number" value={refund} onChange={(e) => setRefund(e.target.value)} placeholder="0.00" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white outline-none" />
                  <p className="text-[10px] text-white/35">Si pones un monto, se acredita al saldo del usuario al resolver.</p>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
                <p className="text-sm"><span className="text-white/40">Estado:</span> {selected ? statusBadge[selected.status].label : ""}</p>
                {selected?.resolution && <p className="text-sm"><span className="text-white/40">Resolución:</span> {selected.resolution}</p>}
                {!!selected?.refundAmount && <p className="text-sm"><span className="text-white/40">Reembolso:</span> S/{selected.refundAmount.toFixed(2)}</p>}
              </div>
            )}
          </div>
          {selected?.status === "open" && (
            <DialogFooter className="flex gap-2">
              <Button variant="outline" className="h-11 flex-1 rounded-xl border-danger/30 bg-transparent font-bold text-danger hover:bg-danger/10" onClick={handleReject} disabled={processing}>Rechazar</Button>
              <Button className="h-11 flex-1 rounded-xl bg-success font-bold text-white hover:bg-success/90" onClick={handleResolve} disabled={processing}>Resolver</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
