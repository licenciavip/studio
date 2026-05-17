"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, query, where, orderBy, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { 
  Loader2, 
  Mail, 
  Smartphone, 
  Lock, 
  Fingerprint, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ExternalLink, 
  Edit2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  ArrowUpRight,
  Copy,
  Landmark,
  Info
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
  
  // States para Registro de Pago (Subir Comprobante)
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrder | null>(null);
  const [formData, setFormData] = useState({
    operationNumber: "",
    bankOrigin: "",
    payerName: "",
    amountPaid: "",
  });

  // States para Crear Nueva Recarga
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [newOrderInstructions, setNewOrderInstructions] = useState<PaymentOrder | null>(null);

  // Suscripción a la Wallet del usuario
  const walletRef = useMemo(() => authUser && firestore ? doc(firestore, "wallets", authUser.uid) : null, [authUser, firestore]);
  const { data: wallet } = useDoc<Wallet>(walletRef);

  // Suscripción a las órdenes de pago del usuario
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
    
    try {
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
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas para recargas
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(firestore, "paymentOrders", orderId), orderData);
      
      setNewOrderInstructions({ ...orderData, createdAt: new Date() } as any);
      setShowRechargeDialog(false);
      setRechargeAmount("");
      toast({ title: "Orden Generada", description: "Sigue las instrucciones para completar tu recarga." });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "No se pudo generar la orden.", variant: "destructive" });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleRegisterPayment = async () => {
    if (!selectedOrder || !firestore) return;
    
    setIsRegistering(true);
    try {
      const orderRef = doc(firestore, "paymentOrders", selectedOrder.id);
      await updateDoc(orderRef, {
        operationNumber: formData.operationNumber,
        bankOrigin: formData.bankOrigin,
        payerName: formData.payerName,
        amountPaid: parseFloat(formData.amountPaid),
        status: "uploaded",
        reviewStatus: "uploaded",
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        proofImageUrl: `https://picsum.photos/seed/${selectedOrder.id}/400/600` 
      });

      toast({ title: "Pago registrado", description: "Tu comprobante está siendo revisado." });
      setSelectedOrder(null);
      setFormData({ operationNumber: "", bankOrigin: "", payerName: "", amountPaid: "" });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "No se pudo registrar el pago.", variant: "destructive" });
    } finally {
      setIsRegistering(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: `${label} copiado al portapapeles.` });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> Pendiente</span>;
      case 'uploaded': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"><Upload className="h-3 w-3" /> En Revisión</span>;
      case 'approved': return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Aprobado</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Rechazado</span>;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
      <section className="lg:col-span-7 space-y-8">
        {/* Wallet Balance Card */}
        <div className="relative overflow-hidden bg-primary-container p-8 rounded-3xl text-on-primary-container shadow-lg shadow-primary/20">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-2">Saldo Disponible</p>
            <h1 className="text-5xl font-sora font-bold mb-8 tracking-tight">
              ${wallet?.balance.toFixed(2) || "0.00"}
            </h1>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setShowRechargeDialog(true)}
                className="bg-surface-container-lowest text-primary rounded-xl px-6 py-3 h-auto font-bold flex items-center gap-2 hover:bg-white transition-all active:scale-95 shadow-sm"
              >
                <Plus className="h-5 w-5" />
                Cargar Saldo
              </Button>
              <Button 
                variant="outline" 
                className="bg-primary/20 border-on-primary-container/30 text-on-primary-container rounded-xl px-6 py-3 h-auto font-bold flex items-center gap-2 hover:bg-primary/30 transition-all active:scale-95"
              >
                <ArrowUpRight className="h-5 w-5" />
                Retirar
              </Button>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Activity List */}
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-2xl font-sora font-bold text-on-surface">Actividad Reciente</h2>
            <Button variant="link" className="text-primary font-bold">Ver Todo</Button>
          </div>
          
          <div className="space-y-3">
            {loadingOrders && <p className="text-center text-muted-foreground py-4">Cargando pagos...</p>}
            {orders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container text-primary">
                    {order.type === 'wallet_recharge' ? <Plus className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">
                      {order.type === 'wallet_recharge' ? 'Recarga de Saldo' : 'Pago de Cupo'}
                    </p>
                    <p className="text-xs text-on-surface-variant">ID: {order.paymentCode}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className={`font-bold ${order.status === 'approved' ? 'text-green-600' : 'text-on-surface'}`}>
                    ${order.amountExpected.toFixed(2)}
                  </p>
                  {getStatusBadge(order.status)}
                  {order.status === 'pending' && (
                    <Button 
                      size="sm" 
                      variant="link" 
                      className="h-auto p-0 text-primary font-bold"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Subir Comprobante
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {!loadingOrders && orders?.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-2xl">
                <p className="text-muted-foreground">No hay actividad registrada.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <aside className="lg:col-span-5 space-y-6">
        {/* User Card */}
        <Card className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner relative border-2 border-primary-fixed">
              <Image 
                src={authUser?.photoURL || "https://picsum.photos/seed/user/200/200"} 
                alt="Profile" 
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-sora font-bold text-on-surface">{authUser?.displayName || "Usuario"}</h3>
              <p className="text-xs font-medium text-on-surface-variant">Miembro desde 2023</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-surface-container text-primary">
              <Edit2 className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group">
              <Mail className="h-5 w-5 text-on-surface-variant group-hover:text-primary" />
              <span className="text-sm font-medium text-on-surface">{authUser?.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group">
              <Smartphone className="h-5 w-5 text-on-surface-variant group-hover:text-primary" />
              <span className="text-sm font-medium text-on-surface">+1 (555) 012-3456</span>
            </div>
          </div>
        </Card>

        {/* Support Section */}
        <Card className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6">
            <nav className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-on-surface-variant group-hover:text-primary" />
                  <span className="text-sm font-medium text-on-surface">Centro de Ayuda</span>
                </div>
                <ExternalLink className="h-5 w-5 text-outline-variant" />
              </button>
            </nav>
          </div>
        </Card>
      </aside>

      {/* DIALOG 1: Crear Recarga */}
      <Dialog open={showRechargeDialog} onOpenChange={setShowRechargeDialog}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-sora">Recargar Billetera</DialogTitle>
            <DialogDescription>Ingresa el monto que deseas cargar a tu cuenta de Poolera.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Monto a recargar (USD)</Label>
              <Input 
                type="number" 
                placeholder="Mínimo $5.00" 
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                className="text-lg font-bold py-6 rounded-xl"
              />
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold text-center">Transferencia directa BCP</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRechargeDialog(false)}>Cancelar</Button>
            <Button 
              className="rounded-xl px-8 py-6" 
              onClick={handleCreateRechargeOrder}
              disabled={isCreatingOrder || !rechargeAmount || parseFloat(rechargeAmount) < 5}
            >
              {isCreatingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generar Orden"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Instrucciones de Nueva Orden */}
      <Dialog open={!!newOrderInstructions} onOpenChange={() => setNewOrderInstructions(null)}>
        <DialogContent className="rounded-3xl max-w-md overflow-hidden p-0 border-none">
          <div className="bg-primary p-8 text-white text-center">
            <div className="mx-auto bg-white/20 rounded-full p-4 w-fit mb-4">
              <Landmark className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-sora font-bold">Instrucciones de Pago</h2>
            <p className="text-white/80 text-sm">Transferencia BCP</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-4">
              <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                <span className="text-xs font-medium text-muted-foreground">Monto exacto:</span>
                <span className="text-xl font-bold text-primary">${newOrderInstructions?.amountExpected.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                <span className="text-xs font-medium text-muted-foreground">Código de pago:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary">{newOrderInstructions?.paymentCode}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(newOrderInstructions?.paymentCode || "", "Código")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Cuenta BCP:</span>
                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-outline-variant">
                  <span className="font-mono text-sm">{BCP_ACCOUNT.number}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(BCP_ACCOUNT.number, "Cuenta")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">Tu recarga aparecerá en tu saldo tras la validación manual (9AM - 7PM).</p>
              </div>
            </div>

            <Button className="w-full rounded-2xl py-6 font-bold" onClick={() => setNewOrderInstructions(null)}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Registrar Pago Realizado (Subir Comprobante) */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-sora">Registrar Pago Realizado</DialogTitle>
            <DialogDescription>
              Ingresa los datos de tu transferencia para validar tu orden {selectedOrder?.paymentCode}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Número de Operación</Label>
              <Input 
                placeholder="Ej: 12345678" 
                value={formData.operationNumber}
                onChange={(e) => setFormData({...formData, operationNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Banco de Origen</Label>
              <Select onValueChange={(val) => setFormData({...formData, bankOrigin: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BCP">BCP (App o Web)</SelectItem>
                  <SelectItem value="Yape">Yape</SelectItem>
                  <SelectItem value="Otros">Otro Banco (Transferencia)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Monto Pagado ($)</Label>
              <Input 
                type="number" 
                placeholder={selectedOrder?.amountExpected.toString()} 
                value={formData.amountPaid}
                onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre del Titular</Label>
              <Input 
                placeholder="Como figura en el banco" 
                value={formData.payerName}
                onChange={(e) => setFormData({...formData, payerName: e.target.value})}
              />
            </div>
            <div className="p-4 border-2 border-dashed rounded-xl text-center space-y-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Adjuntar Comprobante (JPG/PNG)</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedOrder(null)}>Cancelar</Button>
            <Button 
              className="rounded-xl px-8" 
              onClick={handleRegisterPayment}
              disabled={isRegistering || !formData.operationNumber || !formData.amountPaid}
            >
              {isRegistering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enviar Comprobante"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
