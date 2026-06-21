"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getServiceById } from "@/lib/data";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import type { ServiceDoc } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, CheckCircle2, Users, DollarSign,
  Key, Eye, EyeOff, Sparkles, TrendingUp, Info
} from "lucide-react";

type PublicarStep = "config" | "credentials" | "preview" | "success";

function PublicarForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const serviceId = searchParams.get("service") || "";
  const category = searchParams.get("category") || "ia";
  const service = getServiceById(serviceId);

  const [step, setStep] = useState<PublicarStep>("config");
  const [slots, setSlots] = useState(3);
  const [customPrice, setCustomPrice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Configuración del servicio en Firestore (cupos máximos por cuenta).
  const serviceRef = useMemo(
    () => (firestore && serviceId ? doc(firestore, "services", serviceId) : null),
    [firestore, serviceId]
  );
  const { data: serviceDoc } = useDoc<ServiceDoc>(serviceRef);
  const maxSlots = serviceDoc?.maxSlots ?? 5;
  const shareableMax = Math.max(1, maxSlots - 1);

  useEffect(() => {
    if (service?.pricePerMonth) setCustomPrice(service.pricePerMonth);
  }, [service]);

  // El dueño ocupa 1 asiento: no se puede ofrecer más de (maxSlots - 1) cupos.
  useEffect(() => {
    setSlots((s) => Math.min(s, shareableMax));
  }, [shareableMax]);

  if (!service) {
    return (
      <div className="pt-10 pb-32 text-center space-y-4">
        <p className="text-on-surface/40 text-sm">Servicio no encontrado</p>
        <Button asChild variant="link"><Link href="/compartir">Volver</Link></Button>
      </div>
    );
  }

  const priceNum = parseFloat(customPrice || "0");
  const earnings = (priceNum * slots * 0.85).toFixed(2);
  const isWhiteBg = service.color?.toLowerCase() === "#ffffff";

  const handlePublish = async () => {
    if (!firestore || !user) {
      toast({ title: "Error", description: "Debes iniciar sesión.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const id = doc(collection(firestore, "groups")).id;
      await setDoc(doc(firestore, "groups", id), {
        id,
        hostId: user.uid,
        hostName: user.displayName ?? "Anfitrión",
        serviceId: service.id,
        serviceName: service.name,
        serviceColor: service.color ?? null,
        slotsTotal: slots,
        slotsFilled: 0,
        pricePerSlot: priceNum,
        hostEarning: parseFloat(earnings),
        status: "Activo",
        approval: "pending",
        credentials: { email: email.trim(), pass: password },
        nextBill: "—",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStep("success");
    } catch {
      toast({ title: "Error", description: "No se pudo publicar el grupo.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="pt-8 pb-32 flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold tracking-tight">¡Enviado a revisión!</h2>
          <p className="text-[11px] text-on-surface/40 leading-relaxed max-w-xs mx-auto">
            Tu grupo de <span className="font-bold text-on-surface/60">{service.name}</span> fue enviado. Lo revisaremos y, una vez aprobado, quedará visible. Lo verás en "Mis grupos" como "En revisión".
          </p>
        </div>
        <div className="glass-card p-4 rounded-[2rem] w-full max-w-xs space-y-3">
          <div className="flex justify-between"><span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Cupos</span><span className="text-sm font-bold">{slots} disponibles</span></div>
          <div className="flex justify-between"><span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Precio/cupo</span><span className="text-sm font-bold text-primary">S/ {customPrice}/mes</span></div>
          <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-[9px] font-black uppercase tracking-widest text-on-surface/30">Ganancias</span><span className="text-sm font-bold text-green-500">S/ {earnings}/mes</span></div>
        </div>
        <div className="flex gap-3 w-full max-w-xs">
          <Button asChild variant="outline" className="flex-1 rounded-2xl h-10 text-[11px] font-bold"><Link href="/mis-grupos">Mis grupos</Link></Button>
          <Button asChild className="flex-1 rounded-2xl h-10 text-[11px] font-bold"><Link href="/inicio">Inicio</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-2 space-y-5">
      <div className="flex items-center gap-3 px-1">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/40 hover:bg-white/60 active:scale-95 transition-all">
          <Link href={`/compartir/${category}`}><ArrowLeft className="h-4 w-4 text-primary" /></Link>
        </Button>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-on-surface">Publicar cupo</h1>
          <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Compartir {service.name}</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 px-1">
        {(["config", "credentials", "preview"] as PublicarStep[]).map((s, i) => {
          const steps = ["config", "credentials", "preview", "success"];
          const currentIdx = steps.indexOf(step);
          const stepIdx = steps.indexOf(s);
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black transition-all",
                step === s ? "bg-primary text-white" : currentIdx > stepIdx ? "bg-green-500 text-white" : "bg-white/20 text-on-surface/30"
              )}>{currentIdx > stepIdx ? "✓" : i + 1}</div>
              {i < 2 && <div className={cn("flex-1 h-0.5 rounded-full", currentIdx > stepIdx ? "bg-green-500" : "bg-white/10")} />}
            </div>
          );
        })}
      </div>

      {/* Service card */}
      <div className={cn("p-4 rounded-[1.8rem] flex items-center gap-4", isWhiteBg ? "glass-card" : "shadow-lg")} style={{ backgroundColor: !isWhiteBg ? (service.color || "#4343d5") : undefined }}>
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
          <Sparkles className={cn("h-6 w-6", isWhiteBg ? "text-primary" : "text-white")} />
        </div>
        <div>
          <h3 className={cn("text-sm font-extrabold", isWhiteBg ? "text-on-surface" : "text-white")}>{service.name}</h3>
          <p className={cn("text-[9px] font-bold opacity-60 uppercase tracking-widest", isWhiteBg ? "text-on-surface" : "text-white")}>{service.planName}</p>
        </div>
        <div className="ml-auto text-right">
          <p className={cn("text-[8px] font-black uppercase opacity-40", isWhiteBg ? "text-on-surface" : "text-white")}>RECIBES</p>
          <p className={cn("text-base font-extrabold", isWhiteBg ? "text-primary" : "text-white")}>S/ {service.hostEarnings}</p>
        </div>
      </div>

      {/* PASO 1: Config */}
      {step === "config" && (
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-[2rem] space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-on-surface/50">Cupos disponibles</h3>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: shareableMax }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setSlots(n)} className={cn("flex-1 h-9 rounded-xl text-[11px] font-black transition-all", slots === n ? "bg-primary text-white" : "bg-white/20 text-on-surface/40 hover:bg-white/40")}>{n}</button>
                ))}
              </div>
              <p className="text-[9px] text-on-surface/35">Esta cuenta admite hasta {maxSlots} asientos. Como tú usas 1, puedes compartir máximo {shareableMax}.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-on-surface/50">Precio por cupo / mes</h3>
              </div>
              <div className="flex items-center gap-2 glass-card p-3 rounded-xl">
                <span className="text-sm font-black text-on-surface/30">S/</span>
                <input type="number" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} className="flex-1 bg-transparent text-base font-extrabold text-primary outline-none" placeholder={service.pricePerMonth} />
                <span className="text-[9px] font-black text-on-surface/20 uppercase">/mes</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-500/5 rounded-xl border border-green-500/10">
              <TrendingUp className="h-4 w-4 text-green-500 shrink-0" />
              <p className="text-[10px] font-bold text-green-600">Ganarías <span className="font-black">S/ {earnings}/mes</span> con {slots} cupos vendidos</p>
            </div>
          </div>
          <Button className="w-full h-11 rounded-2xl font-bold" onClick={() => setStep("credentials")}>Continuar → Credenciales</Button>
        </div>
      )}

      {/* PASO 2: Credenciales */}
      {step === "credentials" && (
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
              <Info className="h-4 w-4 text-primary shrink-0" />
              <p className="text-[9px] font-medium text-primary/70">Solo visibles para miembros verificados tras pagar.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Email de la cuenta</label>
              <input type="email" placeholder="cuenta@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input w-full h-10 text-sm font-bold px-4" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Contraseña</label>
              <div className="flex gap-2">
                <input type={showPass ? "text" : "password"} placeholder="Contraseña de la cuenta" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input flex-1 h-10 text-sm font-bold px-4" />
                <button onClick={() => setShowPass(!showPass)} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  {showPass ? <EyeOff className="h-4 w-4 text-on-surface/50" /> : <Eye className="h-4 w-4 text-on-surface/50" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-2xl font-bold" onClick={() => setStep("config")}>← Volver</Button>
            <Button className="flex-1 h-11 rounded-2xl font-bold" onClick={() => setStep("preview")} disabled={!email || !password}>Vista previa →</Button>
          </div>
        </div>
      )}

      {/* PASO 3: Preview */}
      {step === "preview" && (
        <div className="space-y-4">
          <div className="glass-card p-5 rounded-[2rem] space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface/30">Resumen del grupo</h3>
            <div className="space-y-3">
              {[["Servicio", service.name], ["Cupos", `${slots} cupos`], ["Precio/cupo", `S/ ${customPrice}/mes`]].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-on-surface/50">{label}</span>
                  <span className="text-sm font-bold">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center border-t border-white/10 pt-3">
                <span className="text-[10px] font-bold text-on-surface/50">Ganancias (85%)</span>
                <span className="text-sm font-extrabold text-green-500">S/ {earnings}/mes</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
              <Key className="h-4 w-4 text-amber-500 shrink-0" />
              <p className="text-[9px] font-medium text-amber-600/70">Credenciales protegidas. Solo miembros activos pueden verlas.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-2xl font-bold" onClick={() => setStep("credentials")}>← Volver</Button>
            <Button className="flex-1 h-11 rounded-2xl font-bold" onClick={handlePublish} disabled={isLoading}>{isLoading ? "Publicando..." : "✓ Publicar grupo"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicarPage() {
  return (
    <Suspense fallback={
      <div className="pt-10 text-center">
        <p className="text-[10px] text-on-surface/30 font-bold uppercase tracking-widest">Cargando...</p>
      </div>
    }>
      <PublicarForm />
    </Suspense>
  );
}
