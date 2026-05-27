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
      case 'pending': return <span className="bg-amber-100/50 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border border-amber-200/50">Pendiente</span>;
      case 'uploaded': return <span className="bg-blue-100/50 text-blue-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border border-blue-200/50">Revisión</span>;
      case 'approved': return <span className="bg-green-100/50 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border border-green-200/50">Aprobado</span>;
      case 'rejected': return <span className="bg-red-100/50 text-red-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border border-red-200/50">Rechazado</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-24 pb-40 px-6 space-y-10">
      {/* Wallet Card - Apple Card Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] p-10 rounded-[2.8rem] text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform active:scale-[0.98]">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
          <TrendingUp className="h-[240px] w-[240px]" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">Saldo Disponible</p>
            <h1 className="text-6xl font-bold tracking-tighter">
              ${wallet?.balance.toFixed(2) || "0.00"}
            </h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowRechargeDialog(true)} 
              className="flex-1 glass-button bg-white text-black rounded-2xl h-14 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Recargar
            </button>
            <button className="flex-1 glass-button bg-white/10 text-white rounded-2xl h-14 text-sm font-bold flex items-center justify-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Retirar
            </button>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <History className="h-4 w-4 text-primary/60" />
          <h2 className="text-sm font-bold text-on-surface/80 tracking-tight">Actividad</h2>
        </div>
        
        <div className="space-y-4">
          {loadingOrders && <p className="text-center text-on-surface-variant/30 py-10 text-[10px] font-black uppercase tracking-widest">Sincronizando...</p>}
          
          {orders?.map((order) => (
            <div key={order.id} className="glass-card p-5 rounded-[2rem] flex items-center justify-between hover:bg-white/40 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/20 text-primary border border-white/30 shadow-sm">
                  {order.type === 'wallet_recharge' ? <Plus className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-on-surface tracking-tight">
                    {order.type === 'wallet_recharge' ? 'Recarga' : 'Suscripción'}
                  </p>
                  <p className="text-[9px] text-on-surface-variant/40 font-black tracking-widest uppercase">{order.paymentCode}</p>
                </div>
              </div>
              <div className="text-right space-y-1.5">
                <p className={`text-base font-bold tracking-tight ${order.status === 'approved' ? 'text-green-600' : 'text-on-surface'}`}>
                  {order.type === 'wallet_recharge' ? '+' : '-'}${order.amountExpected.toFixed(2)}
                </p>
                <div className="flex justify-end">
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </div>
          ))}
          
          {!loadingOrders && orders?.length === 0 && (
            <div className="text-center py-24 glass-card rounded-[3rem] border-dashed border-primary/10">
               <p className="text-on-surface-variant/40 text-sm font-medium">Sin transacciones recientes.</p>
            </div>
          )}
        </div>
      </div>

      {/* RECHARGE DIALOG - APPLE STYLE */}
      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="glass-card rounded-[3rem] max-w-sm p-10">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold text-center tracking-tight">Recargar</DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-on-surface-variant/60">Ingresa el monto (USD)</DialogDescription>
          </DialogHeader>
          <div className="py-10 space-y-6">
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-2xl text-primary/30">$</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={rechargeAmount} 
                onChange={(e) => setRechargeAmount(e.target.value)} 
                className="w-full bg-white/10 backdrop-blur-md rounded-3xl h-20 text-4xl font-bold text-primary pl-12 pr-6 outline-none text-center shadow-inner tracking-tighter"
              />
            </div>
            <p className="text-[9px] text-center font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">MÍNIMO $5.00</p>
          </div>
          <DialogFooter className="flex-col gap-3">
            <Button 
              className="w-full h-14 rounded-2xl text-sm font-bold shadow-xl shadow-primary/10" 
              onClick={handleCreateRechargeOrder} 
              disabled={isCreatingOrder || !rechargeAmount || parseFloat(rechargeAmount) < 5}
            >
              Generar Orden
            </Button>
            <Button variant="ghost" className="w-full h-12 rounded-2xl text-xs font-bold text-on-surface-variant/60" onClick={() => setShowRechargeDialog(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
