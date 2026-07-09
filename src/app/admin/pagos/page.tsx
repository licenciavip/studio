"use client";

import { useMemo, useState } from "react";
import { useFirestore, useCollection, useUser } from "@/firebase";
import {
  collection, query, orderBy, doc, updateDoc, serverTimestamp, increment, arrayUnion, runTransaction,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { paymentStatusConfig } from "@/lib/status";
import { logAdminAction } from "@/lib/admin-log";
import { PageHeader, AdminCard, EmptyState } from "@/components/admin/admin-ui";
import type { PaymentOrder } from "@/lib/types";

export default function AdminPaymentsPage() {
  const firestore = useFirestore();
  const { user, isAdmin } = useUser();
  const { toast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState<PaymentOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const paymentsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "paymentOrders"), orderBy("updatedAt", "desc"));
  }, [firestore]);

  const { data: payments, loading } = useCollection<PaymentOrder>(paymentsQuery);

  // Antifraude: números de operación que aparecen en más de un pago.
  const dupOps = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of payments ?? []) {
      if (p.operationNumber) counts.set(p.operationNumber, (counts.get(p.operationNumber) ?? 0) + 1);
    }
    const set = new Set<string>();
    counts.forEach((n, op) => { if (n > 1) set.add(op); });
    return set;
  }, [payments]);

  // Re-verificación de autorización antes de cualquier operación sensible.
  const ensureAdmin = (): boolean => {
    if (!firestore || !user || !isAdmin) {
      toast({ title: "No autorizado", description: "Tu sesión no tiene permisos de administrador.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleApprove = async (order: PaymentOrder) => {
    if (!ensureAdmin() || !firestore || !user) return;
    setIsProcessing(true);
    try {
      await runTransaction(firestore, async (tx) => {
        const orderRef = doc(firestore, "paymentOrders", order.id);
        const freshOrderSnap = await tx.get(orderRef);
        if (!freshOrderSnap.exists()) throw new Error("ORDER_NOT_FOUND");
        const freshOrder = freshOrderSnap.data() as PaymentOrder;
        if (freshOrder.status !== "uploaded") throw new Error("ORDER_NOT_UPLOADED");

        tx.update(orderRef, {
          status: "approved",
          reviewStatus: "approved",
          reviewedBy: user.uid,
          reviewedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        if (freshOrder.type === "wallet_recharge") {
          const walletRef = doc(firestore, "wallets", freshOrder.userId);
          const walletSnap = await tx.get(walletRef);
          const amount = freshOrder.amountPaid || freshOrder.amountExpected;
          if (walletSnap.exists()) {
            tx.update(walletRef, { balance: increment(amount), updatedAt: serverTimestamp() });
          } else {
            tx.set(walletRef, { userId: freshOrder.userId, balance: amount, currency: freshOrder.currency, updatedAt: serverTimestamp() });
          }
        } else if (freshOrder.type === "membership_payment" && freshOrder.relatedGroupId) {
          const groupRef = doc(firestore, "groups", freshOrder.relatedGroupId);
          const groupSnap = await tx.get(groupRef);
          if (!groupSnap.exists()) throw new Error("GROUP_NOT_FOUND");
          const group = groupSnap.data() as { approval?: string; slotsFilled?: number; slotsTotal?: number; memberIds?: string[]; hostId?: string };
          if (group.approval !== "approved") throw new Error("GROUP_NOT_APPROVED");
          if ((group.memberIds ?? []).includes(freshOrder.userId)) throw new Error("ALREADY_MEMBER");
          if (group.hostId === freshOrder.userId) throw new Error("HOST_CANNOT_JOIN");
          if ((group.slotsFilled ?? 0) >= (group.slotsTotal ?? 0)) throw new Error("GROUP_FULL");
          tx.update(groupRef, {
            memberIds: arrayUnion(freshOrder.userId),
            slotsFilled: increment(1),
            updatedAt: serverTimestamp(),
          });
        }
      });
      await logAdminAction(firestore, user, order.type === "wallet_recharge" ? "recharge_approved" : "payment_approved", {
        targetUserId: order.userId,
        resourceId: order.id,
        details: { paymentCode: order.paymentCode, amount: order.amountPaid || order.amountExpected },
      });
      toast({ title: "Pago aprobado" });
      setSelectedOrder(null);
    } catch (e) {
      const message = e instanceof Error && e.message === "GROUP_FULL"
        ? "El grupo ya no tiene cupos libres."
        : "No se pudo aprobar el pago. Verifica que siga pendiente y que el grupo tenga cupos.";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!ensureAdmin() || !selectedOrder || !firestore || !user) return;
    setIsProcessing(true);
    try {
      await updateDoc(doc(firestore, "paymentOrders", selectedOrder.id), {
        status: "rejected",
        reviewStatus: "rejected",
        rejectedReason: rejectReason,
        reviewedBy: user.uid,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await logAdminAction(firestore, user, selectedOrder.type === "wallet_recharge" ? "recharge_rejected" : "payment_rejected", {
        targetUserId: selectedOrder.userId,
        resourceId: selectedOrder.id,
        details: { paymentCode: selectedOrder.paymentCode, reason: rejectReason },
      });
      toast({ title: "Pago rechazado" });
      setShowRejectDialog(false);
      setSelectedOrder(null);
      setRejectReason("");
    } catch {
      toast({ title: "Error", description: "No se pudo rechazar el pago.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <PageHeader title="Pagos" description="Valida los comprobantes y recargas enviados por los usuarios." />

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando pagos…</p>}
      {!loading && (payments?.length ?? 0) === 0 && (
        <EmptyState title="Sin pagos" description="Cuando los usuarios envíen pagos aparecerán aquí." />
      )}

      <div className="space-y-2">
        {payments?.map((payment) => {
          const cfg = paymentStatusConfig[payment.status];
          return (
            <AdminCard
              key={payment.id}
              className="flex cursor-pointer items-center justify-between transition-colors hover:bg-white/[0.06]"
            >
              <button className="flex flex-1 items-center justify-between text-left" onClick={() => setSelectedOrder(payment)}>
                <div>
                  <p className="text-sm font-bold text-white">{payment.paymentCode}</p>
                  <p className="text-[11px] uppercase tracking-wide text-white/40">{payment.type}</p>
                  {payment.operationNumber && dupOps.has(payment.operationNumber) && (
                    <p className="mt-0.5 text-[9px] font-black uppercase tracking-widest text-danger">⚠ N° operación duplicado</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">S/{payment.amountExpected.toFixed(2)}</p>
                  <span className={cn("inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest", cfg?.badge)}>
                    {cfg?.label || payment.status}
                  </span>
                </div>
              </button>
            </AdminCard>
          );
        })}
      </div>

      {/* Detalle */}
      <Dialog open={!!selectedOrder && !showRejectDialog} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">Detalle {selectedOrder?.paymentCode}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[9px] font-black uppercase text-white/40">Esperado</p>
                <p className="text-lg font-bold">S/{selectedOrder?.amountExpected.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[9px] font-black uppercase text-white/40">Pagado</p>
                <p className="text-lg font-bold text-success">S/{selectedOrder?.amountPaid?.toFixed(2) || "0.00"}</p>
              </div>
            </div>
            {selectedOrder?.operationNumber && (
              <div className={cn("rounded-xl border bg-white/[0.03] p-4", selectedOrder.operationNumber && dupOps.has(selectedOrder.operationNumber) ? "border-danger/40" : "border-white/10")}>
                <p className="text-[9px] font-black uppercase text-white/40">N° de operación</p>
                <p className="font-mono text-sm font-bold">{selectedOrder.operationNumber}</p>
                {selectedOrder.operationNumber && dupOps.has(selectedOrder.operationNumber) && (
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-danger">⚠ Este número ya se usó en otro pago</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="flex-col gap-2">
            {selectedOrder?.status === "uploaded" && (
              <div className="flex w-full gap-2">
                <Button className="h-11 flex-1 rounded-xl bg-success font-bold text-white hover:bg-success/90" onClick={() => handleApprove(selectedOrder)} disabled={isProcessing}>Aprobar</Button>
                <Button variant="outline" className="h-11 flex-1 rounded-xl border-danger/30 bg-transparent font-bold text-danger hover:bg-danger/10" onClick={() => setShowRejectDialog(true)} disabled={isProcessing}>Rechazar</Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rechazo */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-sm rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">Rechazar pago</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Motivo del rechazo</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ej: el número de operación no coincide…"
              className="rounded-xl border-white/10 bg-white/[0.03] text-sm text-white"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" className="h-11 flex-1 rounded-xl border-white/15 bg-transparent font-bold text-white hover:bg-white/10" onClick={() => setShowRejectDialog(false)} disabled={isProcessing}>Cancelar</Button>
            <Button className="h-11 flex-1 rounded-xl bg-danger font-bold text-white hover:bg-danger/90" onClick={handleReject} disabled={isProcessing || !rejectReason.trim()}>Rechazar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
