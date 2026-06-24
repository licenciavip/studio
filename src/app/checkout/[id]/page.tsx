"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BCP_ACCOUNT } from "@/lib/constants";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeft, Sparkles, Landmark, Copy, Hash, CheckCircle2, Users, Star,
} from "lucide-react";
import { LevelBadge } from "@/components/level-badge";
import type { GroupDoc, PaymentConfig, PublicProfile } from "@/lib/types";

type Step = "summary" | "bank" | "operation" | "success";

export default function CheckoutPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [step, setStep] = useState<Step>("summary");
  const [paymentCode, setPaymentCode] = useState("");
  const [operationNumber, setOperationNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const groupRef = useMemo(
    () => (firestore ? doc(firestore, "groups", params.id) : null),
    [firestore, params.id]
  );
  const { data: group, loading: groupLoading } = useDoc<GroupDoc>(groupRef);

  const bankRef = useMemo(() => (firestore ? doc(firestore, "config", "payment") : null), [firestore]);
  const { data: bankCfg } = useDoc<PaymentConfig>(bankRef);
  const bank = bankCfg ?? BCP_ACCOUNT;

  const hostProfileRef = useMemo(() => (firestore && group ? doc(firestore, "publicProfiles", group.hostId) : null), [firestore, group]);
  const { data: hostProfile } = useDoc<PublicProfile>(hostProfileRef);
  const hostRatingCount = hostProfile?.ratingCount ?? 0;
  const hostRatingAvg = hostRatingCount > 0 ? (hostProfile?.ratingSum ?? 0) / hostRatingCount : 0;

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: `${label} copiado.` });
  };

  const goBank = () => {
    setPaymentCode(`PAY-${Math.floor(1000 + Math.random() * 9000)}`);
    setStep("bank");
  };

  const handleConfirm = async () => {
    if (!firestore || !user || !group || !operationNumber.trim()) return;
    setLoading(true);
    try {
      const orderId = doc(collection(firestore, "paymentOrders")).id;
      await setDoc(doc(firestore, "paymentOrders", orderId), {
        id: orderId,
        userId: user.uid,
        type: "membership_payment",
        relatedGroupId: group.id,
        amountExpected: group.pricePerSlot,
        amountPaid: group.pricePerSlot,
        currency: "PEN",
        paymentCode,
        operationNumber: operationNumber.trim(),
        bankDestination: bank.bank,
        destinationAccountNumber: bank.number,
        payerName: user.displayName ?? null,
        status: "uploaded",
        reviewStatus: "uploaded",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStep("success");
    } catch {
      toast({ title: "Error", description: "No se pudo registrar el pago.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (groupLoading) {
    return <p className="pt-10 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface/30">Cargando…</p>;
  }
  if (!group) {
    return (
      <div className="pt-10 text-center space-y-3">
        <p className="text-sm text-on-surface/40">Grupo no encontrado</p>
        <Button asChild variant="link"><Link href="/explorar">Volver a explorar</Link></Button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2 space-y-5">
      {step !== "success" && (
        <button
          onClick={() => (step === "summary" ? router.push("/explorar") : setStep(step === "bank" ? "summary" : "bank"))}
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-on-surface/40"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </button>
      )}

      {/* Resumen */}
      {step === "summary" && (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2rem] p-6 text-white shadow-lg" style={{ background: group.serviceColor || "#4343d5" }}>
            <div className="absolute -right-6 -top-6 opacity-10"><Sparkles className="h-28 w-28" /></div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Unirme a</p>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">{group.serviceName}</h1>
                {hostProfile?.tierKey && <LevelBadge tierKey={hostProfile.tierKey} size="xs" />}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Link href={`/u/${group.hostId}`} className="inline-flex items-center gap-1 text-[11px] underline-offset-2 opacity-80 hover:underline"><Users className="h-3 w-3" /> {group.hostName} · ver perfil</Link>
                {hostRatingCount > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-bold"><Star className="h-3 w-3 fill-white text-white" /> {hostRatingAvg.toFixed(1)}</span>
                )}
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <div className="flex justify-between"><span className="text-[11px] font-bold text-on-surface/50">Precio por cupo</span><span className="text-lg font-extrabold text-primary">S/{group.pricePerSlot.toFixed(2)}<span className="text-[10px] font-medium text-on-surface/40">/mes</span></span></div>
            <p className="text-[10px] text-on-surface/35">Tras validar tu pago, te agregaremos al grupo y verás las credenciales en "Mis grupos".</p>
          </div>
          <Button className="w-full h-11 rounded-2xl font-bold" onClick={goBank}>Continuar al pago</Button>
        </div>
      )}

      {/* Datos bancarios */}
      {step === "bank" && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10"><Landmark className="h-5 w-5 text-primary" /></div>
            <h2 className="text-sm font-bold">Realiza la transferencia</h2>
            <p className="text-[10px] text-on-surface/30">Transfiere el monto exacto a esta cuenta</p>
          </div>
          <div className="glass-card rounded-2xl p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Banco</span><span className="text-[11px] font-bold">{bank.bank}</span></div>
            <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Titular</span><span className="text-[11px] font-bold">{bank.holder}</span></div>
            <div className="flex justify-between items-center border-t border-white/10 pt-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Cuenta</span>
              <div className="flex items-center gap-1.5"><span className="text-[10px] font-mono font-bold">{bank.number}</span><button onClick={() => copyText(bank.number, "Cuenta")} className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10"><Copy className="h-2.5 w-2.5 text-primary" /></button></div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-3 space-y-2">
            <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Monto exacto</span><div className="flex items-center gap-1.5"><span className="text-[13px] font-black text-primary">S/{group.pricePerSlot.toFixed(2)}</span><button onClick={() => copyText(group.pricePerSlot.toFixed(2), "Monto")} className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10"><Copy className="h-2.5 w-2.5 text-primary" /></button></div></div>
            <div className="flex justify-between items-center border-t border-white/10 pt-2"><span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Código</span><div className="flex items-center gap-1.5"><span className="text-[11px] font-mono font-bold text-primary">{paymentCode}</span><button onClick={() => copyText(paymentCode, "Código")} className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10"><Copy className="h-2.5 w-2.5 text-primary" /></button></div></div>
          </div>
          <Button className="w-full h-11 rounded-2xl font-bold" onClick={() => setStep("operation")}>Ya realicé la transferencia →</Button>
        </div>
      )}

      {/* Número de operación */}
      {step === "operation" && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10"><Hash className="h-5 w-5 text-primary" /></div>
            <h2 className="text-sm font-bold">Número de operación</h2>
            <p className="text-[10px] text-on-surface/30">Ingresa el número de tu comprobante</p>
          </div>
          <input type="text" placeholder="Ej: 00123456789" value={operationNumber} onChange={(e) => setOperationNumber(e.target.value)} className="glass-input h-11 w-full text-center text-sm font-bold tracking-widest" />
          <Button className="w-full h-11 rounded-2xl font-bold" onClick={handleConfirm} disabled={loading || !operationNumber.trim()}>{loading ? "Enviando…" : "Confirmar pago"}</Button>
        </div>
      )}

      {/* Éxito */}
      {step === "success" && (
        <div className="flex flex-col items-center pt-8 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10"><CheckCircle2 className="h-8 w-8 text-success" /></div>
          <h2 className="text-xl font-extrabold tracking-tight">¡Pago enviado!</h2>
          <p className="max-w-xs text-sm leading-relaxed text-on-surface/55">Validaremos tu pago y te agregaremos al grupo de {group.serviceName}. Lo verás en "Mis grupos".</p>
          <div className="flex w-full max-w-xs gap-3">
            <Button asChild variant="outline" className="h-11 flex-1 rounded-2xl font-bold"><Link href="/mis-ordenes">Mis órdenes</Link></Button>
            <Button asChild className="h-11 flex-1 rounded-2xl font-bold"><Link href="/mis-grupos">Mis grupos</Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
