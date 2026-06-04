"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BCP_ACCOUNT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  History, Plus, ArrowUpRight, TrendingUp, Copy,
  ArrowLeft, CheckCircle2, Clock, Landmark, Hash
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type RechargeStep = "amount" | "bank-details" | "operation-number" | "success";

const QUICK_AMOUNTS = [10, 20, 50, 100];

type MockOrder = {
  id: string;
  type: "wallet_recharge" | "membership_payment";
  paymentCode: string;
  amountExpected: number;
  status: "pending" | "uploaded" | "approved" | "rejected";
};

const MOCK_ORDERS: MockOrder[] = [
  { id: "1", type: "wallet_recharge", paymentCode: "REC-4821", amountExpected: 50, status: "approved" },
  { id: "2", type: "membership_payment", paymentCode: "PAY-3302", amountExpected: 26.90, status: "approved" },
  { id: "3", type: "wallet_recharge", paymentCode: "REC-9174", amountExpected: 20, status: "uploaded" },
];

export default function BilleteraPage() {
  const { toast } = useToast();
  const [mockBalance] = useState(43.10);
  const [showDialog, setShowDialog] = useState(false);
  const [step, setStep] = useState<RechargeStep>("amount");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const [operationNumber, setOperationNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<MockOrder[]>(MOCK_ORDERS);

  const openDialog = () => {
    setStep("amount");
    setRechargeAmount("");
    setOperationNumber("");
    setShowDialog(true);
  };

  // Paso 1 → 2: generar código y mostrar datos bancarios (mock, sin Firebase)
  const handleConfirmAmount = () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) return;
    setIsLoading(true);
    setTimeout(() => {
      const code = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
      setPaymentCode(code);
      setIsLoading(false);
      setStep("bank-details");
    }, 600);
  };

  // Paso 3 → 4: registrar número de operación (mock)
  const handleSubmitOperation = () => {
    if (!operationNumber.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      const newOrder: MockOrder = {
        id: Date.now().toString(),
        type: "wallet_recharge",
        paymentCode,
        amountExpected: parseFloat(rechargeAmount),
        status: "uploaded",
      };
      setOrders(prev => [newOrder, ...prev]);
      setIsLoading(false);
      setStep("success");
    }, 800);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: `${label} copiado.` });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: { label: "Pendiente", color: "text-amber-500/80" },
      uploaded: { label: "En revisión", color: "text-blue-500/80" },
      approved: { label: "Aprobado", color: "text-green-500/80" },
      rejected: { label: "Rechazado", color: "text-red-500/80" },
    };
    const s = map[status];
    return s ? <span className={`text-[7px] font-black uppercase tracking-widest ${s.color}`}>{s.label}</span> : null;
  };

  return (
    <div className="max-w-xl mx-auto pt-10 pb-24 px-4 space-y-5">
      {/* Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] p-6 rounded-[2.2rem] text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <TrendingUp className="h-20 w-20" />
        </div>
        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-[8px] font-bold opacity-30 uppercase tracking-[0.25em]">Saldo disponible</p>
            <h1 className="text-3xl font-extrabold tracking-tighter">${mockBalance.toFixed(2)}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={openDialog} className="flex-1 bg-white text-black rounded-xl h-9 text-[11px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Plus className="h-3 w-3" /> Recargar
            </button>
            <button className="flex-1 bg-white/10 text-white rounded-xl h-9 text-[11px] font-bold flex items-center justify-center gap-2 backdrop-blur-md border border-white/10 active:scale-95 transition-all">
              <ArrowUpRight className="h-3 w-3" /> Retirar
            </button>
          </div>
        </div>
      </div>

      {/* Actividad */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-2">
          <History className="h-3 w-3 text-on-surface/30" />
          <h2 className="text-[9px] font-bold text-on-surface/30 tracking-tight uppercase">Actividad</h2>
        </div>
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
                  <p className="text-[8px] text-on-surface-variant/30 font-bold uppercase tracking-widest">{order.paymentCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-[11px] font-bold tracking-tight", order.status === "approved" ? "text-green-500" : "text-on-surface")}>
                  {order.type === "wallet_recharge" ? "+" : "-"}${order.amountExpected.toFixed(2)}
                </p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog recarga - 4 pasos estilo PAGO46 */}
      <Dialog open={showDialog} onOpenChange={(open) => { if (!open && step !== "success") setShowDialog(false); if (!open && step === "success") setShowDialog(false); }}>
        <DialogContent className="glass-card rounded-[2.5rem] max-w-[320px] p-0 border-white/20 overflow-hidden">

          {/* PASO 1: Monto */}
          {step === "amount" && (
            <div className="p-6 space-y-5">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-sm font-bold text-center">Recargar Saldo</DialogTitle>
                <DialogDescription className="text-center text-[9px] opacity-40">¿Cuánto quieres recargar?</DialogDescription>
              </DialogHeader>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-black text-on-surface/30">$</span>
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
                    ${amount}
                  </button>
                ))}
              </div>
              <Button
                className="w-full h-10 rounded-2xl text-[11px] font-bold"
                onClick={handleConfirmAmount}
                disabled={isLoading || !rechargeAmount || parseFloat(rechargeAmount) <= 0}
              >
                {isLoading ? "Generando..." : "Continuar →"}
              </Button>
            </div>
          )}

          {/* PASO 2: Datos bancarios */}
          {step === "bank-details" && (
            <div className="p-6 space-y-4">
              <button onClick={() => setStep("amount")} className="flex items-center gap-1 text-[9px] font-bold text-on-surface/30 uppercase tracking-widest">
                <ArrowLeft className="h-3 w-3" /> Volver
              </button>
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Landmark className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold">Realiza la transferencia</h3>
                <p className="text-[9px] text-on-surface/30">Transfiere el monto exacto a esta cuenta</p>
              </div>
              <div className="space-y-2">
                <div className="glass-card p-3 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-on-surface/30">Banco</span>
                    <span className="text-[11px] font-bold">{BCP_ACCOUNT.bank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-on-surface/30">Titular</span>
                    <span className="text-[11px] font-bold">{BCP_ACCOUNT.holder}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-on-surface/30">Cuenta</span>
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
                    <span className="text-[8px] font-black uppercase tracking-widest text-on-surface/30">Monto exacto</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-black text-primary">${parseFloat(rechargeAmount).toFixed(2)}</span>
                      <button onClick={() => copyText(parseFloat(rechargeAmount).toFixed(2), "Monto")} className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                        <Copy className="h-2.5 w-2.5 text-primary" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-on-surface/30">Código</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold font-mono text-primary">{paymentCode}</span>
                      <button onClick={() => copyText(paymentCode, "Código")} className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                        <Copy className="h-2.5 w-2.5 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[8px] text-center text-on-surface/30 font-medium">⚠️ No deposites en agentes BCP. Solo transferencias.</p>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={() => setStep("operation-number")}>
                Ya realicé la transferencia →
              </Button>
            </div>
          )}

          {/* PASO 3: Número de operación */}
          {step === "operation-number" && (
            <div className="p-6 space-y-4">
              <button onClick={() => setStep("bank-details")} className="flex items-center gap-1 text-[9px] font-bold text-on-surface/30 uppercase tracking-widest">
                <ArrowLeft className="h-3 w-3" /> Volver
              </button>
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold">Número de operación</h3>
                <p className="text-[9px] text-on-surface/30">Ingresa el número de tu comprobante de transferencia</p>
              </div>
              <input
                type="text"
                placeholder="Ej: 00123456789"
                value={operationNumber}
                onChange={(e) => setOperationNumber(e.target.value)}
                className="glass-input w-full h-11 text-sm font-bold text-center tracking-widest"
              />
              <p className="text-[8px] text-center text-on-surface/30">
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
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold">¡Recarga enviada!</h3>
                <p className="text-[9px] text-on-surface/40 leading-relaxed">Tu número de operación fue registrado. Validaremos tu pago y acreditaremos el saldo pronto.</p>
              </div>
              <div className="glass-card p-3 rounded-2xl flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                <p className="text-[9px] text-on-surface/50 text-left">Tiempo de validación: <span className="font-bold text-on-surface">2 a 12 horas hábiles</span></p>
              </div>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={() => setShowDialog(false)}>
                Entendido
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
