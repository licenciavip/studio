"use client";

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import {
  collection, query, orderBy, doc, getDoc, updateDoc, serverTimestamp, increment,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { logAdminAction } from "@/lib/admin-log";
import { PageHeader, AdminCard, EmptyState } from "@/components/admin/admin-ui";
import { ENTITIES } from "@/lib/withdrawal";
import type { Withdrawal } from "@/lib/types";

const statusBadge: Record<Withdrawal["status"], { label: string; cls: string }> = {
  pending: { label: "Pendiente", cls: "bg-warning/15 text-warning" },
  paid: { label: "Pagado", cls: "bg-success/15 text-success" },
  rejected: { label: "Rechazado", cls: "bg-danger/15 text-danger" },
};

export default function AdminRetirosPage() {
  const firestore = useFirestore();
  const { user, isAdmin } = useUser();
  const { toast } = useToast();

  const [selected, setSelected] = useState<Withdrawal | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const withdrawalsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "withdrawals"), orderBy("updatedAt", "desc"));
  }, [firestore]);

  const { data: withdrawals, loading } = useCollection<Withdrawal>(withdrawalsQuery);

  const ensureAdmin = (): boolean => {
    if (!firestore || !user || !isAdmin) {
      toast({ title: "No autorizado", variant: "destructive" });
      return false;
    }
    return true;
  };

  // Marcar como pagado: descuenta el saldo (tras verificar fondos) y registra.
  const handlePay = async (w: Withdrawal) => {
    if (!ensureAdmin() || !firestore || !user) return;
    setProcessing(true);
    try {
      const walletRef = doc(firestore, "wallets", w.userId);
      const walletSnap = await getDoc(walletRef);
      const current = walletSnap.exists() ? (walletSnap.data().balance as number) ?? 0 : 0;
      if (current < w.amount) {
        toast({ title: "Saldo insuficiente", description: `El usuario tiene S/${current.toFixed(2)}.`, variant: "destructive" });
        setProcessing(false);
        return;
      }
      await updateDoc(walletRef, { balance: increment(-w.amount), updatedAt: serverTimestamp() });
      await updateDoc(doc(firestore, "withdrawals", w.id), {
        status: "paid",
        reviewedBy: user.uid,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, "withdrawal_paid", {
        targetUserId: w.userId,
        resourceId: w.id,
        details: { amount: w.amount, entity: w.entity, destination: w.destination },
      });
      toast({ title: "Retiro pagado" });
      setSelected(null);
    } catch {
      toast({ title: "Error", description: "No se pudo procesar el retiro.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!ensureAdmin() || !selected || !firestore || !user) return;
    setProcessing(true);
    try {
      await updateDoc(doc(firestore, "withdrawals", selected.id), {
        status: "rejected",
        rejectedReason: reason,
        reviewedBy: user.uid,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, "withdrawal_rejected", {
        targetUserId: selected.userId,
        resourceId: selected.id,
        details: { amount: selected.amount, reason },
      });
      toast({ title: "Retiro rechazado" });
      setShowReject(false);
      setSelected(null);
      setReason("");
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <PageHeader title="Retiros" description="Solicitudes de retiro de saldo de los usuarios." />

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando…</p>}
      {!loading && (withdrawals?.length ?? 0) === 0 && (
        <EmptyState title="Sin retiros" description="Las solicitudes de retiro aparecerán aquí." />
      )}

      <div className="space-y-2">
        {withdrawals?.map((w) => {
          const badge = statusBadge[w.status];
          return (
            <AdminCard key={w.id} className="flex items-center justify-between">
              <button className="flex flex-1 items-center justify-between text-left" onClick={() => setSelected(w)}>
                <div>
                  <p className="text-sm font-bold text-white">{w.holderName}</p>
                  <p className="text-[11px] text-white/40">
                    {ENTITIES[w.entity]?.label} · {w.destination}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">S/{w.amount.toFixed(2)}</p>
                  <span className={cn("inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest", badge.cls)}>
                    {badge.label}
                  </span>
                </div>
              </button>
            </AdminCard>
          );
        })}
      </div>

      {/* Detalle */}
      <Dialog open={!!selected && !showReject} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">Retiro de {selected?.holderName}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[9px] font-black uppercase text-white/40">Monto</p>
              <p className="text-2xl font-bold">S/{selected?.amount.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-1">
              <p className="text-sm"><span className="text-white/40">Entidad:</span> {selected ? ENTITIES[selected.entity]?.label : ""}</p>
              <p className="text-sm"><span className="text-white/40">Destino:</span> <span className="font-mono">{selected?.destination}</span></p>
              <p className="text-sm"><span className="text-white/40">Titular:</span> {selected?.holderName}</p>
              {selected?.docNumber && <p className="text-sm"><span className="text-white/40">DNI:</span> {selected.docNumber}</p>}
            </div>
            <p className="text-[11px] text-white/40">
              Paga manualmente a la cuenta indicada y luego marca como pagado. Eso descontará el saldo del usuario.
            </p>
          </div>
          <DialogFooter className="flex-col gap-2">
            {selected?.status === "pending" && (
              <div className="flex w-full gap-2">
                <Button className="h-11 flex-1 rounded-xl bg-success font-bold text-white hover:bg-success/90" onClick={() => selected && handlePay(selected)} disabled={processing}>Marcar como pagado</Button>
                <Button variant="outline" className="h-11 flex-1 rounded-xl border-danger/30 bg-transparent font-bold text-danger hover:bg-danger/10" onClick={() => setShowReject(true)} disabled={processing}>Rechazar</Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rechazo */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="max-w-sm rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">Rechazar retiro</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Motivo</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: datos de cuenta incorrectos…"
              className="rounded-xl border-white/10 bg-white/[0.03] text-sm text-white"
            />
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
