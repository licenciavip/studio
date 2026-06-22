"use client";

import { useEffect, useMemo, useState } from "react";
import { useFirestore, useDoc, useUser } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { PageHeader, AdminCard } from "@/components/admin/admin-ui";
import { BCP_ACCOUNT } from "@/lib/constants";
import type { PaymentConfig } from "@/lib/types";

export default function AdminConfiguracionPage() {
  const firestore = useFirestore();
  const { user, isAdmin } = useUser();
  const { toast } = useToast();

  const cfgRef = useMemo(() => (firestore ? doc(firestore, "config", "payment") : null), [firestore]);
  const { data: cfg } = useDoc<PaymentConfig>(cfgRef);

  const [bank, setBank] = useState("");
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [cci, setCci] = useState("");
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Prefill: con lo guardado en Firestore o, si no existe, con la constante.
  useEffect(() => {
    if (hydrated) return;
    const src = cfg ?? BCP_ACCOUNT;
    setBank(src.bank ?? "");
    setHolder(src.holder ?? "");
    setNumber(src.number ?? "");
    setCci(src.cci ?? "");
    if (cfg !== null) setHydrated(true);
  }, [cfg, hydrated]);

  const handleSave = async () => {
    if (!firestore || !user || !isAdmin) { toast({ title: "No autorizado", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await setDoc(doc(firestore, "config", "payment"), {
        bank: bank.trim(), holder: holder.trim(), number: number.trim(), cci: cci.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: "Configuración guardada" });
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSaving(false); }
  };

  const field = (label: string, value: string, set: (v: string) => void, placeholder = "") => (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</Label>
      <input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white outline-none" />
    </div>
  );

  return (
    <div>
      <PageHeader title="Configuración" description="Cuenta de cobro donde los usuarios transfieren." />

      <AdminCard className="space-y-3">
        {field("Banco", bank, setBank, "BCP")}
        {field("Titular", holder, setHolder, "Poolera SAC")}
        {field("N° de cuenta", number, setNumber, "191-...")}
        {field("CCI", cci, setCci, "002-...")}
        <Button className="h-11 w-full rounded-xl bg-primary font-bold text-white hover:bg-primary/90" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando…" : "Guardar"}
        </Button>
      </AdminCard>

      <AdminCard className="mt-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/40">Pendiente</p>
        <p className="mt-2 text-[13px] text-white/50">Comisión global, horarios de validación y cuentas por país se añadirán aquí.</p>
      </AdminCard>
    </div>
  );
}
