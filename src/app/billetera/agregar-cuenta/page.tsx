"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { collection, doc, setDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { ENTITIES, ENTITY_LIST } from "@/lib/withdrawal";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import type { WithdrawalEntity } from "@/lib/types";

type Step = "titular" | "entidad" | "confirmar" | "exito";

export default function AgregarCuentaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [step, setStep] = useState<Step>("titular");
  const [holderName, setHolderName] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [entity, setEntity] = useState<WithdrawalEntity | "">("");
  const [destination, setDestination] = useState("");
  const [accountName, setAccountName] = useState("");
  const [saving, setSaving] = useState(false);

  const meta = entity ? ENTITIES[entity] : null;

  const canTitular = holderName.trim().length > 3 && /^\d{8}$/.test(docNumber);
  const canEntidad = entity !== "" && destination.trim().length >= 6;

  const handleSave = async () => {
    if (!firestore || !user || !entity) return;
    setSaving(true);
    try {
      // ¿Es la primera cuenta? Entonces será la principal.
      const existing = await getDocs(query(collection(firestore, "withdrawalAccounts"), where("userId", "==", user.uid)));
      const isPrimary = existing.empty;

      const id = doc(collection(firestore, "withdrawalAccounts")).id;
      await setDoc(doc(firestore, "withdrawalAccounts", id), {
        id,
        userId: user.uid,
        accountName: accountName.trim() || ENTITIES[entity].label,
        holderName: holderName.trim(),
        docType: "DNI",
        docNumber: docNumber.trim(),
        entity,
        destination: destination.trim(),
        isPrimary,
        status: "approved",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStep("exito");
    } catch {
      toast({ title: "Error", description: "No se pudo registrar la cuenta.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24 pt-2">
      {step !== "exito" && (
        <button
          onClick={() => (step === "titular" ? router.push("/billetera") : setStep(step === "entidad" ? "titular" : "entidad"))}
          className="mb-4 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-on-surface/40"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </button>
      )}

      {/* PASO 1: Titular */}
      {step === "titular" && (
        <div className="space-y-4">
          <h1 className="text-xl font-extrabold tracking-tight text-on-surface">Agregar cuenta de retiro</h1>

          <div className="glass-card rounded-2xl p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="text-[12px] font-bold text-on-surface">Información importante</p>
              <p className="mt-0.5 text-[11px] text-on-surface/50 leading-snug">
                Los datos deben ser del titular de la cuenta y coincidir exactamente con los registrados en tu banco.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Nombre y apellido del titular</label>
              <input value={holderName} onChange={(e) => setHolderName(e.target.value)} className="glass-input w-full h-11 text-sm font-bold px-4" placeholder="Tal cual figura en tu banco" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Tipo de documento</label>
              <input value="DNI" disabled className="glass-input w-full h-11 text-sm font-bold px-4 opacity-60" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">N° de documento</label>
              <input value={docNumber} onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, "").slice(0, 8))} className="glass-input w-full h-11 text-sm font-bold px-4" placeholder="Ej: 12345678" inputMode="numeric" />
              <p className="text-right text-[9px] text-on-surface/30">{docNumber.length}/8 dígitos</p>
            </div>
          </div>

          <Button className="w-full h-11 rounded-2xl font-bold" disabled={!canTitular} onClick={() => setStep("entidad")}>Siguiente</Button>
        </div>
      )}

      {/* PASO 2: Entidad */}
      {step === "entidad" && (
        <div className="space-y-4">
          <h1 className="text-xl font-extrabold tracking-tight text-on-surface">Entidad financiera</h1>

          <div className="glass-card rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Titular</p>
            <p className="text-sm font-bold text-on-surface">{holderName}</p>
            <p className="text-[11px] text-on-surface/40">DNI {docNumber}</p>
          </div>

          <div className="glass-card rounded-2xl p-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Elige la entidad</label>
              <div className="grid grid-cols-3 gap-2">
                {ENTITY_LIST.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEntity(e)}
                    className={cn(
                      "py-2.5 rounded-xl text-[12px] font-black border transition-all",
                      entity === e ? "text-white border-transparent" : "bg-white/20 text-on-surface/50 border-white/30"
                    )}
                    style={entity === e ? { background: ENTITIES[e].color } : undefined}
                  >
                    {ENTITIES[e].label}
                  </button>
                ))}
              </div>
            </div>
            {meta && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">{meta.destinationLabel}</label>
                <input value={destination} onChange={(e) => setDestination(e.target.value)} className="glass-input w-full h-11 text-sm font-bold px-4" placeholder={meta.destinationPlaceholder} />
              </div>
            )}
          </div>

          <Button className="w-full h-11 rounded-2xl font-bold" disabled={!canEntidad} onClick={() => setStep("confirmar")}>Siguiente</Button>
        </div>
      )}

      {/* PASO 3: Confirmar */}
      {step === "confirmar" && meta && (
        <div className="space-y-4">
          <h1 className="text-xl font-extrabold tracking-tight text-on-surface">Confirma tus datos</h1>

          <div className="glass-card rounded-2xl p-4 space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Nombre de cuenta (opcional)</label>
            <input value={accountName} onChange={(e) => setAccountName(e.target.value)} className="glass-input w-full h-11 text-sm font-bold px-4" placeholder="¡Puedes nombrarla como quieras!" />
          </div>

          <div className="glass-card rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-on-surface/40">Titular</span><span className="font-bold text-on-surface">{holderName}</span></div>
            <div className="flex justify-between"><span className="text-on-surface/40">DNI</span><span className="font-bold text-on-surface">{docNumber}</span></div>
            <div className="flex justify-between"><span className="text-on-surface/40">Entidad</span><span className="font-bold text-on-surface">{meta.label}</span></div>
            <div className="flex justify-between"><span className="text-on-surface/40">{meta.destinationLabel}</span><span className="font-bold text-on-surface">{destination}</span></div>
          </div>

          <Button className="w-full h-11 rounded-2xl font-bold" disabled={saving} onClick={handleSave}>{saving ? "Registrando..." : "Confirmar"}</Button>
        </div>
      )}

      {/* PASO 4: Éxito */}
      {step === "exito" && meta && (
        <div className="flex flex-col items-center text-center pt-10 space-y-4">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-on-surface">¡Agregaste tu cuenta con éxito!</h1>
          <p className="text-sm text-on-surface/55 max-w-xs leading-relaxed">
            La cuenta <span className="font-bold text-on-surface">{meta.label}</span> a nombre de{" "}
            <span className="font-bold text-on-surface">{holderName}</span> con DNI{" "}
            <span className="font-bold text-on-surface">{docNumber}</span> fue registrada correctamente.
          </p>
          <Button className="w-full max-w-xs h-11 rounded-2xl font-bold" onClick={() => router.push("/billetera")}>Regresar</Button>
        </div>
      )}
    </div>
  );
}
