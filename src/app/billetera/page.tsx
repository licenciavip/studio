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
        toast({ title: "Orden Generada", description: "Sigue las instrucciones para completar tu recarga." });
      })
      .catch(async (err) => {
        const pErr = new FirestorePermissionError({ path: `paymentOrders/${orderId}`, operation: 'create', requestResourceData: orderData });
        errorEmitter.emit('permission-error', pErr);
      })
      .finally(() => setIsCreatingOrder(false));
  };

  const handleRegisterPayment = async () => {
    if (!selectedOrder || !firestore) return;
    
    setIsRegistering(true);
    const updateData = {
      operationNumber: formData.operationNumber,
      bankOrigin: formData.bankOrigin,
      payerName: formData.payerName,
      amountPaid: parseFloat(formData.amountPaid),
      status: "uploaded",
      reviewStatus: "uploaded",
      paidAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      proofImageUrl: `https://picsum.photos/seed/${selectedOrder.id}/400/600` 
    };

    updateDoc(doc(firestore, "paymentOrders", selectedOrder.id), updateData)
      .then(() => {
        toast({ title: "Pago registrado", description: "Tu comprobante está siendo revisado." });
        setSelectedOrder(null);
        setFormData({ operationNumber: "", bankOrigin: "", payerName: "", amountPaid: "" });
      })
      .catch(async (err) => {
        const pErr = new FirestorePermissionError({ path: `paymentOrders/${selectedOrder.id}`, operation: 'update', requestResourceData: updateData });
        errorEmitter.emit('permission-error', pErr);
      })
      .finally(() => setIsRegistering(false));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border border-amber-200">Pendiente</span>;
      case 'uploaded': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border border-blue-200">En revisión</span>;
      case 'approved': return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border border-green-200">Aprobado</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border border-red-200">Rechazado</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-20 pb-32 px-4 space-y-8">
      {/* Wallet Card - Apple Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#6b6bff] p-8 rounded-[3rem] text-white shadow-2xl shadow-primary/30">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <TrendingUp className="h-[200px] w-[200px]" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="space-y-1">
            <p className="text-[11px] font-black opacity-60 uppercase tracking-[0.2em]">Saldo Disponible</p>
            <h1 className="text-5xl font-sora font-extrabold tracking-tighter">
              ${wallet?.balance.toFixed(2) || "0.00"}
            </h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowRechargeDialog(true)} 
              className="flex-1 glass-button bg-white text-primary rounded-2xl h-14 font-bold flex items-center justify-center gap-2 hover:bg-white/90"
            >
              <Plus className="h-5 w-5" />
              Recargar
            </button>
            <button className="flex-1 glass-button bg-white/10 text-white rounded-2xl h-14 font-bold flex items-center justify-center gap-2 hover:bg-white/20">
              <ArrowUpRight className="h-5 w-5" />
              Retirar
            </button>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <History className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold text-on-surface">Actividad</h2>
        </div>
        
        <div className="space-y-4">
          {loadingOrders && <p className="text-center text-on-surface-variant/40 py-8 text-xs font-bold uppercase tracking-widest">Cargando transacciones...</p>}
          
          {orders?.map((order) => (
            <div key={order.id} className="glass-card p-4 rounded-3xl flex items-center justify-between hover:bg-white/60 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10">
                  {order.type === 'wallet_recharge' ? <Plus className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    {order.type === 'wallet_recharge' ? 'Recarga de Saldo' : 'Pago de Servicio'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant/40 font-black tracking-widest uppercase">{order.paymentCode}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className={`text-base font-sora font-extrabold ${order.status === 'approved' ? 'text-green-600' : 'text-on-surface'}`}>
                  {order.type === 'wallet_recharge' ? '+' : '-'}${order.amountExpected.toFixed(2)}
                </p>
                <div className="flex justify-end">
                  {getStatusBadge(order.status)}
                </div>
                {order.status === 'pending' && (
                  <button 
                    className="text-[10px] font-black text-primary hover:underline pt-1" 
                    onClick={() => setSelectedOrder(order)}
                  >
                    SUBIR COMPROBANTE
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {!loadingOrders && orders?.length === 0 && (
            <div className="text-center py-20 glass-card rounded-[3rem] border-dashed border-primary/20 bg-white/20">
               <p className="text-on-surface-variant/60 font-medium">No hay actividad reciente.</p>
            </div>
          )}
        </div>
      </div>

      {/* RECHARGE DIALOG - APPLE STYLE */}
      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="glass-card rounded-[3rem] max-w-sm p-8 border-white/60">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-sora font-extrabold text-center">Recargar</DialogTitle>
            <DialogDescription className="text-center font-medium">Ingresa el monto a recargar en USD</DialogDescription>
          </DialogHeader>
          <div className="py-8 space-y-6">
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-sora font-extrabold text-3xl text-primary/40">$</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={rechargeAmount} 
                onChange={(e) => setRechargeAmount(e.target.value)} 
                className="w-full bg-surface-container rounded-3xl h-20 text-4xl font-sora font-extrabold text-primary pl-12 pr-6 outline-none text-center shadow-inner"
              />
            </div>
            <p className="text-[10px] text-center font-black text-on-surface-variant/40 uppercase tracking-widest">Mínimo $5.00</p>
          </div>
          <DialogFooter className="flex-col gap-3">
            <Button 
              className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20" 
              onClick={handleCreateRechargeOrder} 
              disabled={isCreatingOrder || !rechargeAmount || parseFloat(rechargeAmount) < 5}
            >
              Generar Orden de Pago
            </Button>
            <Button variant="ghost" className="w-full rounded-2xl font-bold" onClick={() => setShowRechargeDialog(false)}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* INSTRUCTIONS DIALOG */}
      <Dialog open={!!newOrderInstructions} onOpenChange={() => setNewOrderInstructions(null)}>
        <DialogContent className="glass-card rounded-[3rem] max-w-sm p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary p-8 text-white text-center space-y-1">
            <h2 className="text-2xl font-sora font-extrabold">Transferencia BCP</h2>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Sigue estos pasos</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 space-y-4">
              <div className="flex justify-between items-center"><span className="text-xs font-bold text-on-surface-variant">Monto:</span><span className="font-sora font-extrabold text-xl text-primary">${newOrderInstructions?.amountExpected.toFixed(2)}</span></div>
              <div className="flex justify-between items-center"><span className="text-xs font-bold text-on-surface-variant">Código:</span><span className="font-mono font-black text-primary">{newOrderInstructions?.paymentCode}</span></div>
              <div className="pt-4 space-y-2">
                <span className="text-[10px] uppercase font-black text-on-surface-variant/40 tracking-widest">Número de Cuenta:</span>
                <div className="bg-white p-4 border border-primary/10 rounded-2xl text-sm font-mono font-bold text-center select-all">{BCP_ACCOUNT.number}</div>
              </div>
            </div>
            <Button className="w-full rounded-2xl h-14 font-bold shadow-lg" onClick={() => setNewOrderInstructions(null)}>He copiado los datos</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
