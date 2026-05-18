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
  Mail, 
  Smartphone, 
  HelpCircle, 
  ChevronRight, 
  Edit2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  ArrowUpRight
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
      case 'pending': return <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> Pendiente</span>;
      case 'uploaded': return <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1"><Upload className="h-2.5 w-2.5" /> Revisión</span>;
      case 'approved': return <span className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> OK</span>;
      case 'rejected': return <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1"><AlertCircle className="h-2.5 w-2.5" /> No</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="relative overflow-hidden bg-primary p-6 rounded-2xl text-white shadow-md">
        <div className="relative z-10">
          <p className="text-[10px] font-medium opacity-80 mb-1 uppercase tracking-wider">Saldo Disponible</p>
          <h1 className="text-3xl font-sora font-bold mb-6 tracking-tight">
            ${wallet?.balance.toFixed(2) || "0.00"}
          </h1>
          <div className="flex gap-3">
            <Button onClick={() => setShowRechargeDialog(true)} size="sm" className="bg-white text-primary rounded-lg px-4 h-9 font-bold flex items-center gap-1.5 hover:bg-white/90">
              <Plus className="h-4 w-4" />
              Recargar
            </Button>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white rounded-lg px-4 h-9 font-bold flex items-center gap-1.5">
              <ArrowUpRight className="h-4 w-4" />
              Retirar
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-sora font-bold text-on-surface uppercase tracking-widest px-1">Actividad Reciente</h2>
        <div className="space-y-2">
          {loadingOrders && <p className="text-center text-muted-foreground py-2 text-xs">Cargando...</p>}
          {orders?.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-white border border-outline-variant/20 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container text-primary">
                  {order.type === 'wallet_recharge' ? <Plus className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    {order.type === 'wallet_recharge' ? 'Recarga' : 'Pago Cupo'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-mono">{order.paymentCode}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p className={`text-sm font-bold ${order.status === 'approved' ? 'text-green-600' : 'text-on-surface'}`}>
                  ${order.amountExpected.toFixed(2)}
                </p>
                {getStatusBadge(order.status)}
                {order.status === 'pending' && (
                  <Button size="sm" variant="link" className="h-auto p-0 text-primary font-bold text-[10px]" onClick={() => setSelectedOrder(order)}>
                    Subir Ticket
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIALOGS REDUCIDOS */}
      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="rounded-2xl max-w-sm p-5">
          <DialogHeader><DialogTitle className="text-lg">Recargar Saldo</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <Label className="text-xs">Monto (USD)</Label>
            <Input type="number" placeholder="Mínimo $5.00" value={rechargeAmount} onChange={(e) => setRechargeAmount(e.target.value)} className="text-xl font-bold py-5 rounded-xl h-11" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowRechargeDialog(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleCreateRechargeOrder} disabled={isCreatingOrder || !rechargeAmount || parseFloat(rechargeAmount) < 5}>
              Generar Orden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!newOrderInstructions} onOpenChange={() => setNewOrderInstructions(null)}>
        <DialogContent className="rounded-2xl max-w-sm p-0 overflow-hidden border-none">
          <div className="bg-primary p-6 text-white text-center">
            <h2 className="text-xl font-sora font-bold">Transferencia BCP</h2>
            <p className="text-white/70 text-xs">Instrucciones</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-sm space-y-2">
              <div className="flex justify-between items-center"><span>Monto:</span><span className="font-bold text-primary">${newOrderInstructions?.amountExpected.toFixed(2)}</span></div>
              <div className="flex justify-between items-center"><span>Código:</span><span className="font-mono font-bold text-primary">{newOrderInstructions?.paymentCode}</span></div>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Número de Cuenta:</span>
                <div className="bg-white p-2 border rounded-lg text-xs font-mono mt-1 text-center">{BCP_ACCOUNT.number}</div>
              </div>
            </div>
            <Button size="sm" className="w-full rounded-lg h-10 font-bold" onClick={() => setNewOrderInstructions(null)}>Entendido</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="rounded-2xl max-w-sm p-5">
          <DialogHeader><DialogTitle className="text-lg">Registrar Pago</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Número de Operación" className="h-10 text-sm" value={formData.operationNumber} onChange={(e) => setFormData({...formData, operationNumber: e.target.value})} />
            <Select onValueChange={(val) => setFormData({...formData, bankOrigin: val})}>
              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Banco Origen" /></SelectTrigger>
              <SelectContent><SelectItem value="BCP">BCP</SelectItem><SelectItem value="Yape">Yape</SelectItem><SelectItem value="Otros">Otros</SelectItem></SelectContent>
            </Select>
            <Input type="number" placeholder="Monto Pagado" className="h-10 text-sm" value={formData.amountPaid} onChange={(e) => setFormData({...formData, amountPaid: e.target.value})} />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>Cancelar</Button>
            <Button size="sm" onClick={handleRegisterPayment} disabled={isRegistering || !formData.operationNumber || !formData.amountPaid}>
              Enviar Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}