"use client";

import { useMemo, useState } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, getDoc, serverTimestamp, increment } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ExternalLink, Loader2, Eye, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import type { PaymentOrder } from "@/lib/types";

export default function AdminPaymentsPage() {
  const firestore = useFirestore();
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

  const handleApprove = async (order: PaymentOrder) => {
    if (!firestore) return;
    setIsProcessing(true);
    try {
      await updateDoc(doc(firestore, "paymentOrders", order.id), {
        status: "approved",
        reviewStatus: "approved",
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      if (order.type === 'wallet_recharge') {
        const walletRef = doc(firestore, "wallets", order.userId);
        const walletSnap = await getDoc(walletRef);
        if (walletSnap.exists()) {
          await updateDoc(walletRef, { balance: increment(order.amountPaid || order.amountExpected), updatedAt: serverTimestamp() });
        } else {
          await setDoc(walletRef, { userId: order.userId, balance: order.amountPaid || order.amountExpected, currency: order.currency, updatedAt: serverTimestamp() });
        }
      }
      toast({ title: "Pago Aprobado" });
      setSelectedOrder(null);
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleReject = async () => {
    if (!selectedOrder || !firestore) return;
    setIsProcessing(true);
    try {
      await updateDoc(doc(firestore, "paymentOrders", selectedOrder.id), {
        status: "rejected",
        reviewStatus: "rejected",
        rejectedReason: rejectReason,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast({ title: "Pago Rechazado" });
      setShowRejectDialog(false);
      setSelectedOrder(null);
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2.5 rounded-2xl text-primary">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Validación de Pagos</h1>
          <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Panel Administrativo</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading && <div className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-on-surface/30">Cargando pagos...</div>}
        {payments?.map((payment) => (
          <div key={payment.id} className="glass-card p-4 rounded-2xl flex items-center justify-between hover:bg-white/50 transition-all cursor-pointer" onClick={() => setSelectedOrder(payment)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center border border-white/40 shadow-sm text-primary">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-on-surface tracking-tight">{payment.paymentCode}</h3>
                <p className="text-[9px] text-on-surface-variant/50 font-medium uppercase tracking-tighter">{payment.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-primary">${payment.amountExpected.toFixed(2)}</p>
              <Badge variant={payment.status === 'approved' ? 'default' : 'outline'} className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full">
                {payment.status}
              </Badge>
            </div>
          </div>
        ))}
        {!loading && payments?.length === 0 && <div className="text-center py-20 text-[10px] font-black uppercase tracking-widest text-on-surface/20">No hay pagos pendientes</div>}
      </div>

      {/* Detalle Dialog */}
      <Dialog open={!!selectedOrder && !showRejectDialog} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="glass-card rounded-[2.5rem] max-w-lg p-6 border-white/50">
          <DialogHeader><DialogTitle className="text-lg font-bold">Detalle {selectedOrder?.paymentCode}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4 rounded-2xl space-y-1">
                <p className="text-[8px] font-black text-on-surface/40 uppercase">Esperado</p>
                <p className="text-lg font-bold">${selectedOrder?.amountExpected.toFixed(2)}</p>
              </div>
              <div className="glass-card p-4 rounded-2xl space-y-1">
                <p className="text-[8px] font-black text-on-surface/40 uppercase">Pagado</p>
                <p className="text-lg font-bold text-primary">${selectedOrder?.amountPaid?.toFixed(2) || "0.00"}</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden aspect-video relative bg-muted">
              {selectedOrder?.proofImageUrl ? (
                <Image src={selectedOrder.proofImageUrl} alt="Comprobante" fill className="object-contain p-2" />
              ) : (
                <div className="flex items-center justify-center h-full text-[10px] font-black uppercase opacity-20">Sin comprobante</div>
              )}
            </div>
          </div>
          <DialogFooter className="flex-col gap-2">
            {selectedOrder?.status === 'uploaded' && (
              <div className="flex gap-2 w-full">
                <Button className="flex-1 rounded-xl h-11 font-bold" onClick={() => handleApprove(selectedOrder)}>Aprobar</Button>
                <Button variant="outline" className="flex-1 rounded-xl h-11 font-bold text-red-600 border-red-100" onClick={() => setShowRejectDialog(true)}>Rechazar</Button>
              </div>
            )}
            <Button variant="ghost" className="w-full text-[10px] font-bold uppercase" asChild>
              <a href={selectedOrder?.proofImageUrl} target="_blank">Ver imagen completa</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}