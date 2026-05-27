"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, where, orderBy, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { 
  Loader2, 
  History,
  Plus,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { PaymentOrder, Wallet } from "@/lib/types";

const BCP_ACCOUNT = {
  number: "191-987654321-0-12",
  holder: "Poolera SAC",
  bank: "BCP"
};

export default function BilleteraPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const authUser = auth?.currentUser;
  
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const walletRef = useMemo(() => authUser && firestore ? doc(firestore, "wallets", authUser.uid) : null, [authUser, firestore]);
  const { data: wallet } = useDoc<Wallet>(walletRef);

  const ordersQuery = useMemo(() => {
    if (!firestore || !authUser) return null;
    return query(
      collection(firestore, "paymentOrders"),
      where("userId", "==", authUser.uid),
      orderBy("createdAt", "desc")
    );
  }, [firestore, authUser]);
  
  const { data: orders, loading: loadingOrders } = useCollection<PaymentOrder>(ordersQuery);

  const handleCreateRechargeOrder = async () => {
    if (!authUser || !firestore || !rechargeAmount) return;
    
    setIsCreatingOrder(true);
    const orderId = doc(collection(firestore, "paymentOrders")).id;
    const paymentCode = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const orderData: any = {
      id: orderId,
      userId: authUser.uid,
      type: "wallet_recharge",
      amountExpected: parseFloat(rechargeAmount),
      currency: "USD",
      paymentCode: paymentCode,
      bankDestination: "BCP",
      destinationAccountNumber: BCP_ACCOUNT.number,
      status: "pending",
      reviewStatus: "waiting_upload",
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    setDoc(doc(firestore, "paymentOrders", orderId), orderData)
      .then(() => {
        setShowRechargeDialog(false);
        setRechargeAmount("");
        toast({ title: "Orden Generada", description: "Sigue las instrucciones." });
      })
      .catch(async (err) => {
        const pErr = new FirestorePermissionError({ path: `paymentOrders/${orderId}`, operation: 'create', requestResourceData: orderData });
        errorEmitter.emit('permission-error', pErr);
      })
      .finally(() => setIsCreatingOrder(false));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest">Pendiente</span>;
      case 'uploaded': return <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">Revisión</span>;
      case 'approved': return <span className="text-[7px] font-black text-green-500 uppercase tracking-widest">Aprobado</span>;
      case 'rejected': return <span className="text-[7px] font-black text-red-500 uppercase tracking-widest">Rechazado</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-12 pb-24 px-4 space-y-5">
      {/* Apple Card Style - Compact */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] p-6 rounded-[2rem] text-white shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
          <TrendingUp className="h-[100px] w-[100px]" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="space-y-0">
            <p className="text-[8px] font-black opacity-40 uppercase tracking-[0.2em]">Saldo Disponible</p>
            <h1 className="text-3xl font-bold tracking-tighter">
              ${wallet?.balance.toFixed(2) || "0.00"}
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowRechargeDialog(true)} 
              className="flex-1 bg-white text-black rounded-xl h-9 text-[11px] font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Recargar
            </button>
            <button className="flex-1 bg-white/10 text-white rounded-xl h-9 text-[11px] font-bold flex items-center justify-center gap-1.5 backdrop-blur-md border border-white/10">
              <ArrowUpRight className="h-3.5 w-3.5" /> Retirar
            </button>
          </div>
        </div>
      </div>

      {/* Activity Section - High Density */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-2">
          <History className="h-3 w-3 text-on-surface/40" />
          <h2 className="text-[10px] font-bold text-on-surface/40 tracking-tight uppercase">Actividad Reciente</h2>
        </div>
        
        <div className="space-y-1.5">
          {loadingOrders && <p className="text-center text-on-surface-variant/20 py-4 text-[8px] font-black uppercase">Sincronizando...</p>}
          
          {orders?.map((order) => (
            <div key={order.id} className="glass-card p-3 rounded-2xl flex items-center justify-between hover:bg-white/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/40 text-primary border border-white/40 shadow-sm">
                  {order.type === 'wallet_recharge' ? <Plus className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface tracking-tight">
                    {order.type === 'wallet_recharge' ? 'Recarga' : 'Suscripción'}
                  </p>
                  <p className="text-[7px] text-on-surface-variant/40 font-black tracking-widest uppercase">{order.paymentCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold tracking-tight ${order.status === 'approved' ? 'text-green-600' : 'text-on-surface'}`}>
                  {order.type === 'wallet_recharge' ? '+' : '-'}${order.amountExpected.toFixed(2)}
                </p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
          
          {!loadingOrders && orders?.length === 0 && (
            <div className="text-center py-10 glass-card rounded-[2rem] border-dashed border-primary/10">
               <p className="text-on-surface-variant/30 text-[10px] font-medium uppercase tracking-widest">Sin transacciones</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="glass-card rounded-[2.2rem] max-w-[300px] p-6 border-white/50">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-bold text-center tracking-tight">Recargar Saldo</DialogTitle>
            <DialogDescription className="text-center text-[10px] font-medium text-on-surface-variant/60">Ingresa el monto en dólares</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <input 
              type="number" 
              placeholder="0.00" 
              value={rechargeAmount} 
              onChange={(e) => setRechargeAmount(e.target.value)} 
              className="glass-input w-full h-11 text-xl font-bold text-primary text-center tracking-tighter"
            />
            <p className="text-[7px] text-center font-black text-on-surface-variant/30 uppercase tracking-[0.2em]">MÍNIMO $5.00</p>
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button className="w-full h-10 rounded-xl text-[11px] font-bold" onClick={handleCreateRechargeOrder} disabled={isCreatingOrder || !rechargeAmount || parseFloat(rechargeAmount) < 5}>
              Generar Orden
            </Button>
            <Button variant="ghost" className="w-full h-9 rounded-xl text-[9px] font-bold text-on-surface-variant/60" onClick={() => setShowRechargeDialog(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}