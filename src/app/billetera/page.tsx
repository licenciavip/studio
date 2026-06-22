"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BCP_ACCOUNT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { paymentStatusConfig } from "@/lib/status";
import { ENTITIES } from "@/lib/withdrawal";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { collection, query, where, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  History, Plus, ArrowUpRight, TrendingUp, Copy, ArrowLeft,
  CheckCircle2, Clock, Landmark, Hash, CreditCard, ChevronRight, Star,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { PaymentOrder, Wallet, Withdrawal, WithdrawalAccount, PaymentConfig } from "@/lib/types";

type RechargeStep = "amount" | "bank-details" | "operation-number" | "success";
const QUICK_AMOUNTS = [10, 20, 50, 100];

interface ActivityItem {
  id: string;
  label: string;
  code: string;
  amount: number;
  sign: "+" | "-";
  statusText: string;
  statusClass: string;
  ts: number;
}

const toMs = (v: unknown): number =>
  v && typeof v === "object" && "seconds" in v ? (v as { seconds: number }).seconds * 1000 : 0;

const withdrawStatusMap: Record<Withdrawal["status"], { label: string; cls: string }> = {
  pending: { label: "En proceso", cls: "text-warning" },
  paid: { label: "Pagado", cls: "text-on-surface/50" },
  rejected: { label: "Rechazado", cls: "text-danger" },
};

export default function BilleteraPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  // Recarga
  const [showDialog, setShowDialog] = useState(false);
  const [step, setStep] = useState<RechargeStep>("amount");
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const [operationNumber, setOperationNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Retiro
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [wLoading, setWLoading] = useState(false);
  const [wDone, setWDone] = useState(false);

  const walletRef = useMemo(
    () => (firestore && user ? doc(firestore, "wallets", user.uid) : null),
    [firestore, user]
  );
  const { data: wallet } = useDoc<Wallet>(walletRef);
  const balance = wallet?.balance ?? 0;

  // Cuenta de cobro configurable (Firestore) con respaldo a la constante.
  const bankRef = useMemo(() => (firestore ? doc(firestore, "config", "payment") : null), [firestore]);
  const { data: bankCfg } = useDoc<PaymentConfig>(bankRef);
  const bank = bankCfg ?? BCP_ACCOUNT;

  const ordersQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "paymentOrders"), where("userId", "==", user.uid)) : null),
    [firestore, user]
  );
  const { data: ordersRaw, loading: ordersLoading } = useCollection<PaymentOrder>(ordersQuery);

  const withdrawalsQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "withdrawals"), where("userId", "==", user.uid)) : null),
    [firestore, user]
  );
  const { data: withdrawals } = useCollection<Withdrawal>(withdrawalsQuery);

  const accountsQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "withdrawalAccounts"), where("userId", "==", user.uid)) : null),
    [firestore, user]
  );
  const { data: accounts } = useCollection<WithdrawalAccount>(accountsQuery);

  const pendingWithdrawTotal = useMemo(
    () => (withdrawals ?? []).filter((w) => w.status === "pending").reduce((acc, w) => acc + w.amount, 0),
    [withdrawals]
  );
  const available = Math.max(0, balance - pendingWithdrawTotal);

  // Actividad unificada: recargas, pagos y retiros.
  const activity = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];
    for (const o of ordersRaw ?? []) {
      const cfg = paymentStatusConfig[o.status];
      items.push({
        id: o.id,
        label: o.type === "wallet_recharge" ? "Recarga" : "Suscripción",
        code: o.paymentCode,
        amount: o.amountExpected,
        sign: o.type === "wallet_recharge" ? "+" : "-",
        statusText: cfg?.label ?? o.status,
        statusClass: cfg?.text ?? "text-on-surface/40",
        ts: toMs(o.updatedAt),
      });
    }
    for (const w of withdrawals ?? []) {
      const s = withdrawStatusMap[w.status];
      items.push({
        id: w.id,
        label: "Retiro",
        code: ENTITIES[w.entity]?.label ?? "Retiro",
        amount: w.amount,
        sign: "-",
        statusText: s.label,
        statusClass: s.cls,
        ts: toMs(w.updatedAt),
      });
    }
    return items.sort((a, b) => b.ts - a.ts);
  }, [ordersRaw, withdrawals]);

  // ── Recarga ──
  const openDialog = () => {
    setStep("amount"); setRechargeAmount(""); setOperationNumber(""); setPaymentCode(""); setShowDialog(true);
  };
  const handleConfirmAmount = () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) return;
    setPaymentCode(`REC-${Math.floor(1000 + Math.random() * 9000)}`);
    setStep("bank-details");
  };
  const handleSubmitOperation = async () => {
    if (!operationNumber.trim() || !firestore || !user) return;
    setIsLoading(true);
    try {
      const orderId = doc(collection(firestore, "paymentOrders")).id;
      const amount = parseFloat(rechargeAmount);
      await setDoc(doc(firestore, "paymentOrders", orderId), {
        id: orderId, userId: user.uid, type: "wallet_recharge",
        amountExpected: amount, amountPaid: amount, currency: "PEN",
        paymentCode, operationNumber: operationNumber.trim(),
        bankDestination: bank.bank, destinationAccountNumber: bank.number,
        payerName: user.displayName ?? null, status: "uploaded", reviewStatus: "uploaded",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setStep("success");
    } catch {
      toast({ title: "Error", description: "No se pudo registrar la recarga.", variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  // ── Retiro (todo el saldo disponible) ──
  const openWithdraw = () => {
    if (available <= 0) { toast({ title: "Sin saldo", description: "No tienes saldo disponible para retirar." }); return; }
    if (!accounts || accounts.length === 0) {
      toast({ title: "Agrega una cuenta", description: "Primero registra una cuenta de retiro." });
      return;
    }
    const primary = accounts.find((a) => a.isPrimary) ?? accounts[0];
    setSelectedAccountId(primary.id);
    setWDone(false);
    setShowWithdraw(true);
  };
  const handleWithdraw = async () => {
    if (!firestore || !user || !accounts) return;
    const acc = accounts.find((a) => a.id === selectedAccountId);
    if (!acc || available <= 0) return;
    setWLoading(true);
    try {
      const id = doc(collection(firestore, "withdrawals")).id;
      await setDoc(doc(firestore, "withdrawals", id), {
        id, userId: user.uid, amount: available, currency: "PEN",
        accountId: acc.id, entity: acc.entity, holderName: acc.holderName,
        destination: acc.destination, docNumber: acc.docNumber,
        status: "pending", createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setWDone(true);
    } catch {
      toast({ title: "Error", description: "No se pudo solicitar el retiro.", variant: "destructive" });
    } finally { setWLoading(false); }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: `${label} copiado.` });
  };

  return (
    <div className="pb-24 pt-2 space-y-5">
      {/* Saldo disponible */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] p-6 rounded-[2.2rem] text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><TrendingUp className="h-20 w-20" /></div>
        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-[9px] font-bold opacity-40 uppercase tracking-[0.25em]">Disponible para retirar</p>
            <h1 className="text-3xl font-extrabold tracking-tighter">S/{available.toFixed(2)}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={openDialog} className="flex-1 bg-white text-black rounded-xl h-9 text-[11px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Plus className="h-3 w-3" /> Recargar
            </button>
            <button onClick={openWithdraw} className="flex-1 bg-white/10 text-white rounded-xl h-9 text-[11px] font-bold flex items-center justify-center gap-2 backdrop-blur-md border border-white/10 active:scale-95 transition-all">
              <ArrowUpRight className="h-3 w-3" /> Retirar
            </button>
          </div>
        </div>
      </div>

      {/* Saldo en camino (pendiente de retiro) */}
      {pendingWithdrawTotal > 0 && (
        <div className="glass-card rounded-[1.6rem] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center"><Clock className="h-4 w-4 text-warning" /></div>
            <div>
              <p className="text-[12px] font-bold text-on-surface">Saldo en camino</p>
              <p className="text-[10px] text-on-surface/40">En proceso de retiro</p>
            </div>
          </div>
          <p className="text-sm font-extrabold text-on-surface">S/{pendingWithdrawTotal.toFixed(2)}</p>
        </div>
      )}

      {/* Cuentas de retiro */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-2">
          <CreditCard className="h-3 w-3 text-on-surface/30" />
          <h2 className="text-[10px] font-bold text-on-surface/30 tracking-tight uppercase">Mis cuentas de retiro</h2>
        </div>
        {(accounts ?? []).map((a) => (
          <div key={a.id} className="glass-card p-3.5 rounded-[1.5rem] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-black" style={{ background: ENTITIES[a.entity]?.color }}>
                {ENTITIES[a.entity]?.label.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[12px] font-bold text-on-surface flex items-center gap-1">
                  {a.accountName || ENTITIES[a.entity]?.label}
                  {a.isPrimary && <Star className="h-3 w-3 fill-warning text-warning" />}
                </p>
                <p className="text-[10px] text-on-surface/40">{a.holderName} · {a.destination}</p>
              </div>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-success">Aprobada</span>
          </div>
        ))}
        <Link href="/billetera/agregar-cuenta" className="no-underline">
          <div className="glass-card p-3.5 rounded-[1.5rem] flex items-center justify-between border-dashed transition-colors hover:bg-white/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Plus className="h-4 w-4 text-primary" /></div>
              <p className="text-[12px] font-bold text-primary">Agregar cuenta de retiro</p>
            </div>
            <ChevronRight className="h-4 w-4 text-on-surface/25" />
          </div>
        </Link>
      </div>

      {/* Actividad */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 px-2">
          <History className="h-3 w-3 text-on-surface/30" />
          <h2 className="text-[10px] font-bold text-on-surface/30 tracking-tight uppercase">Actividad</h2>
        </div>
        {ordersLoading && <p className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-on-surface/30">Cargando…</p>}
        {!ordersLoading && activity.length === 0 && (
          <div className="glass-card rounded-[1.5rem] py-10 text-center">
            <p className="text-[11px] font-bold text-on-surface/40">Aún no tienes movimientos</p>
          </div>
        )}
        <div className="space-y-1.5">
          {activity.map((it) => (
            <div key={it.id} className="glass-card p-3 rounded-[1.5rem] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-primary border border-white/10">
                  {it.sign === "+" ? <Plus className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface tracking-tight">{it.label}</p>
                  <p className="text-[9px] text-on-surface-variant/30 font-bold uppercase tracking-widest">{it.code}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-[11px] font-bold tracking-tight", it.sign === "+" && it.statusText === "Aprobado" ? "text-success" : "text-on-surface")}>
                  {it.sign}S/{it.amount.toFixed(2)}
                </p>
                <span className={cn("text-[9px] font-black uppercase tracking-widest", it.statusClass)}>{it.statusText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog recarga */}
      <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
        <DialogContent className="glass-card rounded-[2.5rem] max-w-[320px] p-0 border-white/20 overflow-hidden">
          {step === "amount" && (
            <div className="p-6 space-y-5">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-sm font-bold text-center">Recargar Saldo</DialogTitle>
                <DialogDescription className="text-center text-[10px] opacity-40">¿Cuánto quieres recargar?</DialogDescription>
              </DialogHeader>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-black text-on-surface/30">S/</span>
                  <input type="number" placeholder="0.00" value={rechargeAmount} onChange={(e) => setRechargeAmount(e.target.value)} className="glass-input w-28 h-12 text-2xl font-black text-primary text-center tracking-tighter border-none bg-transparent outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {QUICK_AMOUNTS.map((a) => (
                  <button key={a} onClick={() => setRechargeAmount(String(a))} className={cn("py-1.5 rounded-xl text-[10px] font-black border transition-all", rechargeAmount === String(a) ? "bg-primary text-white border-primary" : "bg-white/20 text-on-surface/50 border-white/30 hover:bg-white/40")}>S/{a}</button>
                ))}
              </div>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={handleConfirmAmount} disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}>Continuar →</Button>
            </div>
          )}
          {step === "bank-details" && (
            <div className="p-6 space-y-4">
              <button onClick={() => setStep("amount")} className="flex items-center gap-1 text-[10px] font-bold text-on-surface/30 uppercase tracking-widest"><ArrowLeft className="h-3 w-3" /> Volver</button>
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2"><Landmark className="h-5 w-5 text-primary" /></div>
                <h3 className="text-sm font-bold">Realiza la transferencia</h3>
                <p className="text-[10px] text-on-surface/30">Transfiere el monto exacto a esta cuenta</p>
              </div>
              <div className="space-y-2">
                <div className="glass-card p-3 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Banco</span><span className="text-[11px] font-bold">{bank.bank}</span></div>
                  <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Titular</span><span className="text-[11px] font-bold">{bank.holder}</span></div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Cuenta</span>
                    <div className="flex items-center gap-1.5"><span className="text-[10px] font-bold font-mono">{bank.number}</span><button onClick={() => copyText(bank.number, "Cuenta")} className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center"><Copy className="h-2.5 w-2.5 text-primary" /></button></div>
                  </div>
                </div>
                <div className="glass-card p-3 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Monto exacto</span>
                    <div className="flex items-center gap-1.5"><span className="text-[13px] font-black text-primary">S/{parseFloat(rechargeAmount || "0").toFixed(2)}</span><button onClick={() => copyText(parseFloat(rechargeAmount || "0").toFixed(2), "Monto")} className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center"><Copy className="h-2.5 w-2.5 text-primary" /></button></div>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Código</span>
                    <div className="flex items-center gap-1.5"><span className="text-[11px] font-bold font-mono text-primary">{paymentCode}</span><button onClick={() => copyText(paymentCode, "Código")} className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center"><Copy className="h-2.5 w-2.5 text-primary" /></button></div>
                  </div>
                </div>
              </div>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={() => setStep("operation-number")}>Ya realicé la transferencia →</Button>
            </div>
          )}
          {step === "operation-number" && (
            <div className="p-6 space-y-4">
              <button onClick={() => setStep("bank-details")} className="flex items-center gap-1 text-[10px] font-bold text-on-surface/30 uppercase tracking-widest"><ArrowLeft className="h-3 w-3" /> Volver</button>
              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2"><Hash className="h-5 w-5 text-primary" /></div>
                <h3 className="text-sm font-bold">Número de operación</h3>
              </div>
              <input type="text" placeholder="Ej: 00123456789" value={operationNumber} onChange={(e) => setOperationNumber(e.target.value)} className="glass-input w-full h-11 text-sm font-bold text-center tracking-widest" />
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={handleSubmitOperation} disabled={isLoading || !operationNumber.trim()}>{isLoading ? "Enviando..." : "Confirmar recarga"}</Button>
            </div>
          )}
          {step === "success" && (
            <div className="p-6 space-y-4 text-center">
              <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="h-7 w-7 text-success" /></div>
              <div className="space-y-1"><h3 className="text-sm font-bold">¡Recarga enviada!</h3><p className="text-[10px] text-on-surface/40 leading-relaxed">Validaremos tu pago y acreditaremos el saldo pronto.</p></div>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={() => setShowDialog(false)}>Entendido</Button>
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
                <DialogDescription className="text-center text-[10px] opacity-40">Se retira todo tu saldo disponible</DialogDescription>
              </DialogHeader>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Monto a retirar</p>
                <p className="text-3xl font-black text-primary tracking-tighter">S/{available.toFixed(2)}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Cuenta destino</p>
                {(accounts ?? []).map((a) => (
                  <button key={a.id} onClick={() => setSelectedAccountId(a.id)} className={cn("w-full flex items-center justify-between p-3 rounded-2xl border transition-all", selectedAccountId === a.id ? "border-primary bg-primary/5" : "border-white/30 bg-white/20")}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[9px] font-black" style={{ background: ENTITIES[a.entity]?.color }}>{ENTITIES[a.entity]?.label.slice(0, 2).toUpperCase()}</div>
                      <div className="text-left">
                        <p className="text-[11px] font-bold text-on-surface">{a.accountName || ENTITIES[a.entity]?.label}</p>
                        <p className="text-[9px] text-on-surface/40">{a.destination}</p>
                      </div>
                    </div>
                    {selectedAccountId === a.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={handleWithdraw} disabled={wLoading || !selectedAccountId}>{wLoading ? "Enviando..." : "Solicitar retiro"}</Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="h-7 w-7 text-success" /></div>
              <div className="space-y-1"><h3 className="text-sm font-bold">¡Solicitud enviada!</h3><p className="text-[10px] text-on-surface/40 leading-relaxed">Tu retiro está en proceso. El monto quedó reservado de tu saldo disponible.</p></div>
              <Button className="w-full h-10 rounded-2xl text-[11px] font-bold" onClick={() => setShowWithdraw(false)}>Entendido</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
