"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { UserAvatar } from "@/components/user-avatar";
import { reserveSlug } from "@/lib/slug";
import { AVATAR_SEEDS, avatarUrl } from "@/lib/avatars";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicProfile } from "@/lib/types";

export default function EditarPerfilPage() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const profileRef = useMemo(() => (firestore && user ? doc(firestore, "publicProfiles", user.uid) : null), [firestore, user]);
  const { data: profile } = useDoc<PublicProfile>(profileRef);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [seed, setSeed] = useState("");
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated || !user) return;
    setName(user.displayName ?? "");
    setPhone(profile?.phone ?? "");
    setWhatsapp(profile?.whatsapp ?? "");
    setSeed(profile?.avatarSeed ?? "");
    if (profile !== undefined) setHydrated(true);
  }, [user, profile, hydrated]);

  const save = async () => {
    if (!firestore || !user) return;
    setSaving(true);
    try {
      const finalName = name.trim() || (user.displayName ?? "Usuario");
      if (name.trim() && name.trim() !== user.displayName) await updateProfile(user, { displayName: name.trim() });
      const slug = await reserveSlug(firestore, user.uid, finalName);
      await setDoc(doc(firestore, "publicProfiles", user.uid), {
        uid: user.uid,
        displayName: finalName,
        slug,
        avatarSeed: seed,
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: "Perfil actualizado" });
      router.push("/perfil");
    } catch {
      toast({ title: "Error", description: "No se pudo guardar.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24 pt-2 space-y-5">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/40">
          <button onClick={() => router.push("/perfil")}><ArrowLeft className="h-4 w-4 text-primary" /></button>
        </Button>
        <h1 className="text-lg font-extrabold tracking-tight text-on-surface">Editar perfil</h1>
      </div>

      {/* Avatar actual */}
      <div className="flex flex-col items-center gap-3">
        <UserAvatar name={name} seed={seed} size={72} className="border border-white/30 shadow-lg" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/40">Elige tu avatar</p>
        <div className="grid grid-cols-6 gap-2">
          {AVATAR_SEEDS.map((s) => (
            <button key={s} onClick={() => setSeed(s)} className={cn("relative rounded-xl p-0.5 transition-all active:scale-90", seed === s ? "ring-2 ring-primary" : "ring-1 ring-white/30")}>
              <img src={avatarUrl(s)} alt={s} className="h-full w-full rounded-lg bg-white/60" />
              {seed === s && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white"><Check className="h-2.5 w-2.5" /></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Campos */}
      <div className="glass-card rounded-[1.8rem] p-5 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Nombre</Label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="glass-input w-full h-11 text-sm font-bold px-4" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Teléfono</Label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej: 914146017" className="glass-input w-full h-11 text-sm font-bold px-4" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">WhatsApp</Label>
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Ej: +51914146017" className="glass-input w-full h-11 text-sm font-bold px-4" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Correo</Label>
          <input value={user?.email ?? ""} disabled className="glass-input w-full h-11 text-sm font-bold px-4 opacity-50" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button className="h-12 rounded-2xl font-bold" onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</Button>
        <Button variant="outline" className="h-12 rounded-2xl font-bold" onClick={() => router.push("/perfil")} disabled={saving}>Descartar</Button>
      </div>
    </div>
  );
}
