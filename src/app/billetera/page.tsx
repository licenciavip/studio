"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, where, orderBy, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { 
  Loader2, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  ArrowUpRight,
  TrendingUp,
  History
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrder | null>(null);
  const [formData, setFormData] = useState({
    operationNumber: "",
    bankOrigin: "",
    payerName: "",
    amountPaid: "",
  });

  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [newOrderInstructions, setNewOrderInstructions] = useState<PaymentOrder | null>(null);

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
        setNewOrderInstructions({ ...orderData, createdAt: new Date() } as any);
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
      case 'pending': return <span className="bg-amber-100/40 text-amber-700 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border border-amber-200/30">Pendiente</span>;
      case 'uploaded': return <span className="bg-blue-100/40 text-blue-700 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border border-blue-200/30">Revisión</span>;
      case 'approved': return <span className="bg-green-100/40 text-green-700 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border border-green-200/30">Aprobado</span>;
      case 'rejected': return <span className="bg-red-100/40 text-red-700 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border border-red-200/30">Rechazado</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-16 pb-28 px-4 space-y-7">
      {/* Wallet Card - Apple Card Style - Compact */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] p-8 rounded-[2.2rem] text-white shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <TrendingUp className="h-[180px] w-[180px]" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em]">Saldo Disponible</p>
            <h1 className="text-4xl font-bold tracking-tighter">
              ${wallet?.balance.toFixed(2) || "0.00"}
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowRechargeDialog(true)} 
              className="flex-1 glass-button bg-white text-black rounded-xl h-11 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Recargar
            </button>
            <button className="flex-1 glass-button bg-white/10 text-white rounded-xl h-11 text-xs font-bold flex items-center justify-center gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Retirar
            </button>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 px-2">
          <History className="h-3.5 w-3.5 text-primary/60" />
          <h2 className="text-[11px] font-bold text-on-surface/60 tracking-tight uppercase">Actividad</h2>
        </div>
        
        <div className="space-y-3">
          {loadingOrders && <p className="text-center text-on-surface-variant/30 py-6 text-[9px] font-black uppercase tracking-widest">Sincronizando...</p>}
          
          {orders?.map((order) => (
            <div key={order.id} className="glass-card p-3.5 rounded-[1.6rem] flex items-center justify-between hover:bg-white/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/30 text-primary border border-white/40 shadow-sm">
                  {order.type === 'wallet_recharge' ? <Plus className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                </div>
                <div className="space-y-0">
                  <p className="text-xs font-bold text-on-surface tracking-tight">
                    {order.type === 'wallet_recharge' ? 'Recarga' : 'Suscripción'}
                  </p>
                  <p className="text-[8px] text-on-surface-variant/40 font-black tracking-widest uppercase">{order.paymentCode}</p>
                </div>
              </div>
              <div className="text-right space-y-0.5">
                <p className={`text-sm font-bold tracking-tight ${order.status === 'approved' ? 'text-green-600' : 'text-on-surface'}`}>
                  {order.type === 'wallet_recharge' ? '+' : '-'}${order.amountExpected.toFixed(2)}
                </p>
                <div className="flex justify-end">
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </div>
          ))}
          
          {!loadingOrders && orders?.length === 0 && (
            <div className="text-center py-12 glass-card rounded-[2rem] border-dashed border-primary/10">
               <p className="text-on-surface-variant/40 text-[11px] font-medium">Sin transacciones recientes.</p>
            </div>
          )}
        </div>
      </div>

      {/* RECHARGE DIALOG */}
      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="glass-card rounded-[2.2rem] max-w-[320px] p-8">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-center tracking-tight">Recargar</DialogTitle>
            <DialogDescription className="text-center text-xs font-medium text-on-surface-variant/60">Ingresa el monto (USD)</DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg text-primary/30">$</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={rechargeAmount} 
                onChange={(e) => setRechargeAmount(e.target.value)} 
                className="w-full bg-white/20 backdrop-blur-md rounded-2xl h-14 text-2xl font-bold text-primary pl-10 pr-4 outline-none text-center shadow-inner tracking-tighter"
              />
            </div>
            <p className="text-[8px] text-center font-black text-on-surface-variant/30 uppercase tracking-[0.2em]">MÍNIMO $5.00</p>
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button 
              className="w-full h-11 rounded-xl text-xs font-bold" 
              onClick={handleCreateRechargeOrder} 
              disabled={isCreatingOrder || !rechargeAmount || parseFloat(rechargeAmount) < 5}
            >
              Generar Orden
            </Button>
            <Button variant="ghost" className="w-full h-10 rounded-xl text-[10px] font-bold text-on-surface-variant/60" onClick={() => setShowRechargeDialog(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}