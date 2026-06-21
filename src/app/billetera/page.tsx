"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BCP_ACCOUNT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { paymentStatusConfig } from "@/lib/status";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import {
  collection, query, where, doc, setDoc, serverTimestamp,
} from "firebase/firestore";
import {
  History, Plus, ArrowUpRight, TrendingUp, Copy,
  ArrowLeft, CheckCircle2, Clock, Landmark, Hash,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { PaymentOrder, Wallet, Withdrawal, WithdrawalMethod } from "@/lib/types";

type RechargeStep = "amount" | "bank-details" | "operation-number" | "success";

const QUICK_AMOUNTS = [10, 20, 50, 100];

export default function BilleteraPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [showDialog, setShowDialog] = useState(false);
  const [step, setStep] = useState<RechargeStep>("amount");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const [operationNumber, setOperationNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Retiro
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [wAmount, setWAmount] = useState("");
  const [wMethod, setWMethod] = useState<WithdrawalMethod>("yape");
  const [wDestination, setWDestination] = useState("");
  const [wHolder, setWHolder] = useState("");
  const [wLoading, setWLoading] = useState(false);
  const [wDone, setWDone] = useState(false);

  // Saldo real de Firestore (colección wallets/{uid}).
  const walletRef = useMemo(
    () => (firestore && user ? doc(firestore, "wallets", user.uid) : null),
    [firestore, user]
  );
  const { data: wallet } = useDoc<Wallet>(walletRef);
  const balance = wallet?.balance ?? 0;

  // Actividad real: pagos del usuario (sin orderBy para no exigir índice compuesto).
  const ordersQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "paymentOrders"), where("userId", "==", user.uid)) : null),
    [firestore, user]
  );
  const { data: ordersRaw, loading: ordersLoading } = useCollection<PaymentOrder>(ordersQuery);

  const orders = useMemo(() => {
    const toMs = (v: unknown): number => {
      if (v && typeof v === "object" && "seconds" in v) return (v as { seconds: number }).seconds * 1000;
      return 0;
    };
    return [...(ordersRaw ?? [])].sort((a, b) => toMs(b.updatedAt) - toMs(a.updatedAt));
  }, [ordersRaw]);

  // Retiros del usuario (para calcular el saldo realmente disponible).
  const withdrawalsQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "withdrawals"), where("userId", "==", user.uid)) : null),
    [firestore, user]
  );
  const { data: withdrawals } = useCollection<Withdrawal>(withdrawalsQuery);

  // El saldo disponible descuenta los retiros pendientes (aún no pagados),
  // para que el usuario no pueda solicitar más de lo que tiene.
  const pendingWithdrawTotal = useMemo(
    () => (withdrawals ?? []).filter((w) => w.status === "pending").reduce((acc, w) => acc + w.amount, 0),
    [withdrawals]
  );
  const available = Math.max(0, balance - pendingWithdrawTotal);

  const openWithdraw = () => {
    setWAmount("");
    setWDestination("");
    setWHolder(user?.displayName ?? "");
    setWMethod("yape");
    setWDone(false);
    setShowWithdraw(true);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(wAmount);
    if (!firestore || !user) return;
    if (!amount || amount <= 0) return;
    if (amount > available) {
      toast({ title: "Saldo insuficiente", description: `Disponible: S/${available.toFixed(2)}`, variant: "destructive" });
      return;
    }
    if (!wDestination.trim() || !wHolder.trim()) return;
    setWLoading(true);
    try {
      const id = doc(collection(firestore, "withdrawals")).id;
      await setDoc(doc(firestore, "withdrawals", id), {
        id,
        userId: user.uid,
        amount,
        currency: "PEN",
        method: wMethod,
        destination: wDestination.trim(),
        holderName: wHolder.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setWDone(true);
    } catch {
      toast({ title: "Error", description: "No se pudo registrar el retiro.", variant: "destructive" });
    } finally {
      setWLoading(false);
    }
  };

  const openDialog = () => {
    setStep("amount");
    setRechargeAmount("");
    setOperationNumber("");
    setPaymentCode("");
    setShowDialog(true);
  };

  // Paso 1 → 2: generar código de pago.
  const handleConfirmAmount = () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) return;
    setPaymentCode(`REC-${Math.floor(1000 + Math.random() * 9000)}`);
    setStep("bank-details");
  };

  // Paso 3 → 4: crear la orden de recarga REAL en Firestore (estado "uploaded"
  // para que el admin la vea y pueda validarla).
  const handleSubmitOperation = async () => {
    if (!operationNumber.trim() || !firestore || !user) return;
    setIsLoading(true);
    try {
      const orderId = doc(collection(firestore, "paymentOrders")).id;
      const amount = parseFloat(rechargeAmount);
      await setDoc(doc(firestore, "paymentOrders", orderId), {
        id: orderId,
        userId: user.uid,
        type: "wallet_recharge",
        amountExpected: amount,
        amountPaid: amount,
        currency: "PEN",
        paymentCode,
        operationNumber: operationNumber.trim(),
        bankDestination: BCP_ACCOUNT.bank,
        destinationAccountNumber: BCP_ACCOUNT.number,
        payerName: user.displayName ?? null,
        status: "uploaded",
        reviewStatus: "uploaded",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStep("success");
    } catch {
      toast({ title: "Error", description: "No se pudo registrar la recarga.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: `${label} copiado.` });
  };

  const getStatusBadge = (status: PaymentOrder["status"]) => {
    const s = paymentStatusConfig[status];
    return s ? <span className={`text-[9px] font-black uppercase tracking-widest ${s.text}`}>{s.label}</span> : null;
  };

  return (
    <div className="pb-24 pt-2 space-y-5">
      {/* Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] p-6 rounded-[2.2rem] text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <TrendingUp className="h-20 w-20" />
        </div>
        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-[9px] font-bold opacity-40 uppercase tracking-[0.25em]">Saldo disponible</p>
            <h1 className="text-3xl font-extrabold tracking-tighter">S/{balance.toFixed(2)}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={openDialog} className="flex-1 bg-white text-black rounded-xl h-9 text-[11px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Plus className="h-3 w-3" /> Recargar
            </button>
            <button
              onClick={openWithdraw}
              className="flex-1 bg-white/10 text-white rounded-xl h-9 text-[11px] font-bold flex items-center justify-center gap-2 backdrop-blur-md border border-white/10 active:scale-95 transition-all"
            >
              <ArrowUpRight className="h-3 w-3" /> Retirar
            </button>
          </div>
        </div>
      </div>

      {/* Actividad */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-2">
          <History className="h-3 w-3 text-on-surface/30" />
          <h2 className="text-[10px] font-bold text-on-surface/30 tracking-tight uppercase">Actividad</h2>
        </div>

        {ordersLoading && (
          <p className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-on-surface/30">Cargando…</p>
        )}
        {!ordersLoading && orders.length === 0 && (
          <div className="glass-card rounded-[1.5rem] py-10 text-center">
            <p className="text-[11px] font-bold text-on-surface/40">Aún no tienes movimientos</p>
            <p className="mt-1 text-[10px] text-on-surface/30">Recarga tu saldo para empezar</p>
          </div>
        )}

        <div className="space-y-1.5">
          {orders.map((order) => (
            <div key={order.id} className="glass-card p-3 rounded-[1.5rem] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-primary border border-white/10">
                  {order.type === "wallet_recharge" ? <Plus className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface tracking-tight">
                    {order.type === "wallet_recharge" ? "Recarga" : "Suscripción"}
                  </p>
                  <p className="text-[9px] text-on-surface-variant/30 font-bold uppercase tracking-widest">{order.paymentCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-[11px] font-bold tracking-tight", order.status === "approved" ? "text-success" : "text-on-surface")}>
                  {order.type === "wallet_recharge" ? "+" : "-"}S/{order.amountExpected.toFixed(2)}
                </p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog recarga - 4 pasos estilo PAGO46 */}
      <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
        <DialogContent className="glass-card rounded-[2.5rem] max-w-[320px] p-0 border-white/20 overflow-hidden">

          {/* PASO 1: Monto */}
          {step === "amount" && (
            <div className="p-6 space-y-5">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-sm font-bold text-center">Recargar Saldo</DialogTitle>
                <DialogDescription className="text-center text-[10px] opacity-40">¿Cuánto quieres recargar?</DialogDescription>
              </DialogHeader>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-black text-on-surface/30">S/</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="glass-input w-28 h-12 text-2xl font-black text-primary text-center tracking-tighter border-none bg-transparent outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setRechargeAmount(String(amount))}
                    className={cn(
                      "py-1.5 rounded-xl text-[10px] font-black border transition-all",
                      rechargeAmount === String(amount)
                        ? "bg-primary text-white border-primary"
                        : "bg-white/20 text-on-surface/50 border-white/30 hover:bg-white/40"
                    )}
                  >
                    S/{amount}
                  </button>
                ))}
              </div>
              <Button
                className="w-full h-10 rounded-2xl text-[11px] font-bold"
                onClick={handleConfirmAmount}
                disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
              >
                Continuar →
              </Button>
            </div>
          )}

          {/* PASO 2: Datos bancarios */}
          {step === "bank-details" && (
            <div className="p-6 space-y-4">
              <button onClick={() => setStep("amount")} className="flex items-center gap-1 text-[10px] font-bold text-on-surface/30 uppercase tracking-widest">
                <ArrowLeft className="h-3 w-3" /> Volver
              </button>
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Landmark className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold">Realiza la transferencia</h3>
                <p className="text-[10px] text-on-surface/30">Transfiere el monto exacto a esta cuenta</p>
              </div>
              <div className="space-y-2">
                <div className="glass-card p-3 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Banco</span>
                    <span className="text-[11px] font-bold">{BCP_ACCOUNT.bank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Titular</span>
                    <span className="text-[11px] font-bold">{BCP_ACCOUNT.holder}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Cuenta</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold font-mono">{BCP_ACCOUNT.number}</span>
                      <button onClick={() => copyText(BCP_ACCOUNT.number, "Cuenta")} className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                        <Copy className="h-2.5 w-2.5 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-3 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Monto exacto</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-black text-primary">S/{parseFloat(rechargeAmount).toFixed(2)}</span>
                      <button onClick={() => copyText(parseFloat(rechargeAmount).toFixed(2), "Monto")} className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                        <Copy className="h-2.5 w-2.5 text-primary" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Código</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold font-mono text-primary">{paymentCode}</span>
                      <button onClick={() => copyText(paymentCode, "Código")} className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                        <Copy className="h-2.5 w-2.5 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-center text-on-surface/30 font-medium">⚠️ No deposites en agentes BCP. Solo transferencias.</p>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={() => setStep("operation-number")}>
                Ya realicé la transferencia →
              </Button>
            </div>
          )}

          {/* PASO 3: Número de operación */}
          {step === "operation-number" && (
            <div className="p-6 space-y-4">
              <button onClick={() => setStep("bank-details")} className="flex items-center gap-1 text-[10px] font-bold text-on-surface/30 uppercase tracking-widest">
                <ArrowLeft className="h-3 w-3" /> Volver
              </button>
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold">Número de operación</h3>
                <p className="text-[10px] text-on-surface/30">Ingresa el número de tu comprobante de transferencia</p>
              </div>
              <input
                type="text"
                placeholder="Ej: 00123456789"
                value={operationNumber}
                onChange={(e) => setOperationNumber(e.target.value)}
                className="glass-input w-full h-11 text-sm font-bold text-center tracking-widest"
              />
              <p className="text-[9px] text-center text-on-surface/30">
                Encuéntralo en tu comprobante como "N° de operación" o "N° de transacción"
              </p>
              <Button
                className="w-full h-10 rounded-2xl text-[11px] font-bold"
                onClick={handleSubmitOperation}
                disabled={isLoading || !operationNumber.trim()}
              >
                {isLoading ? "Enviando..." : "Confirmar recarga"}
              </Button>
            </div>
          )}

          {/* PASO 4: Éxito */}
          {step === "success" && (
            <div className="p-6 space-y-4 text-center">
              <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold">¡Recarga enviada!</h3>
                <p className="text-[10px] text-on-surface/40 leading-relaxed">Tu número de operación fue registrado. Validaremos tu pago y acreditaremos el saldo pronto.</p>
              </div>
              <div className="glass-card p-3 rounded-2xl flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning shrink-0" />
                <p className="text-[10px] text-on-surface/50 text-left">Tiempo de validación: <span className="font-bold text-on-surface">2 a 12 horas hábiles</span></p>
              </div>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={() => setShowDialog(false)}>
                Entendido
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog retiro */}
      <Dialog open={showWithdraw} onOpenChange={() => setShowWithdraw(false)}>
        <DialogContent className="glass-card rounded-[2.5rem] max-w-[320px] p-6 border-white/20">
          {!wDone ? (
            <div className="space-y-4">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-sm font-bold text-center">Retirar saldo</DialogTitle>
                <DialogDescription className="text-center text-[10px] opacity-40">
                  Disponible: S/{available.toFixed(2)}
                </DialogDescription>
              </DialogHeader>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-black text-on-surface/30">S/</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={wAmount}
                    onChange={(e) => setWAmount(e.target.value)}
                    className="glass-input w-28 h-12 text-2xl font-black text-primary text-center tracking-tighter border-none bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Método */}
              <div className="grid grid-cols-2 gap-2">
                {(["yape", "transfer"] as WithdrawalMethod[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setWMethod(m)}
                    className={cn(
                      "py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all",
                      wMethod === m ? "bg-primary text-white border-primary" : "bg-white/20 text-on-surface/50 border-white/30"
                    )}
                  >
                    {m === "yape" ? "Yape" : "Transferencia"}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder={wMethod === "yape" ? "Número de Yape" : "N° de cuenta o CCI"}
                value={wDestination}
                onChange={(e) => setWDestination(e.target.value)}
                className="glass-input w-full h-11 text-sm font-bold px-4"
              />
              <input
                type="text"
                placeholder="Nombre del titular"
                value={wHolder}
                onChange={(e) => setWHolder(e.target.value)}
                className="glass-input w-full h-11 text-sm font-bold px-4"
              />

              <Button
                className="w-full h-10 rounded-2xl text-[11px] font-bold"
                onClick={handleWithdraw}
                disabled={wLoading || !wAmount || parseFloat(wAmount) <= 0 || !wDestination.trim() || !wHolder.trim()}
              >
                {wLoading ? "Enviando..." : "Solicitar retiro"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold">¡Solicitud enviada!</h3>
                <p className="text-[10px] text-on-surface/40 leading-relaxed">
                  Procesaremos tu retiro y te pagaremos a la brevedad. El monto queda reservado de tu saldo disponible.
                </p>
              </div>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={() => setShowWithdraw(false)}>
                Entendido
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
