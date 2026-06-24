"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useFirestore, useDoc, useCollection } from "@/firebase";
import { signOut, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc, serverTimestamp, collection, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/user-avatar";
import { AVATAR_SEEDS, avatarUrl } from "@/lib/avatars";
import { TIERS, computeScore, levelFor } from "@/lib/levels";
import {
  Lock, HelpCircle, LogOut, Edit2, ChevronRight, ShieldCheck, Bell, CreditCard,
  ExternalLink, Check, Crown, Mail, Phone, MessageCircle, BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicProfile, GroupDoc } from "@/lib/types";

export default function PerfilPage() {
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [showAvatar, setShowAvatar] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const profileRef = useMemo(() => (firestore && user ? doc(firestore, "publicProfiles", user.uid) : null), [firestore, user]);
  const { data: profile } = useDoc<PublicProfile>(profileRef);

  const groupsRef = useMemo(() => (firestore && user ? query(collection(firestore, "groups"), where("hostId", "==", user.uid)) : null), [firestore, user]);
  const { data: groups } = useCollection<GroupDoc>(groupsRef);

  // Nivel
  const active = (groups ?? []).filter((g) => g.approval === "approved");
  const createdAtMs = profile?.createdAt && typeof profile.createdAt === "object" && "seconds" in profile.createdAt
    ? (profile.createdAt as { seconds: number }).seconds * 1000 : undefined;
  const score = computeScore({
    createdAtMs,
    groupsActive: active.length,
    membersServed: active.reduce((a, g) => a + g.slotsFilled, 0),
    ratingSum: profile?.ratingSum ?? 0,
  });
  const lvl = levelFor(score);

  // Verificaciones
  const emailVerified = !!user?.emailVerified;
  const phoneSet = !!profile?.phone;
  const profileComplete = !!profile?.avatarSeed && phoneSet;
  const verifiedCount = (emailVerified ? 1 : 0) + (phoneSet ? 1 : 0) + (profileComplete ? 1 : 0);

  // Espejar verificaciones al perfil público (para el badge).
  useEffect(() => {
    if (!firestore || !user || !profile) return;
    const wantEmail = emailVerified;
    const wantProfile = profileComplete;
    if (profile.verifiedEmail !== wantEmail || profile.verifiedProfile !== wantProfile) {
      updateDoc(doc(firestore, "publicProfiles", user.uid), { verifiedEmail: wantEmail, verifiedProfile: wantProfile }).catch(() => {});
    }
  }, [firestore, user, profile, emailVerified, profileComplete]);

  const handleLogout = async () => {
    try { await signOut(auth); router.push("/login"); }
    catch { toast({ title: "Error", variant: "destructive" }); }
  };

  const verifyEmail = async () => {
    if (!user) return;
    try { await sendEmailVerification(user); toast({ title: "Correo enviado", description: "Revisa tu bandeja y haz clic en el enlace." }); }
    catch { toast({ title: "Error", description: "No se pudo enviar el correo.", variant: "destructive" }); }
  };

  const openEdit = () => {
    setName(user?.displayName ?? "");
    setPhone(profile?.phone ?? "");
    setWhatsapp(profile?.whatsapp ?? "");
    setShowEdit(true);
  };

  const saveProfile = async () => {
    if (!firestore || !user) return;
    setSaving(true);
    try {
      if (name.trim() && name.trim() !== user.displayName) await updateProfile(user, { displayName: name.trim() });
      await setDoc(doc(firestore, "publicProfiles", user.uid), {
        uid: user.uid, displayName: name.trim() || (user.displayName ?? "Usuario"),
        phone: phone.trim(), whatsapp: whatsapp.trim(), updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({ title: "Perfil actualizado" });
      setShowEdit(false);
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSaving(false); }
  };

  const pickAvatar = async (seed: string) => {
    if (!firestore || !user) return;
    setSaving(true);
    try {
      await setDoc(doc(firestore, "publicProfiles", user.uid), { uid: user.uid, displayName: user.displayName ?? "Usuario", avatarSeed: seed, updatedAt: serverTimestamp() }, { merge: true });
      toast({ title: "Avatar actualizado" });
      setShowAvatar(false);
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSaving(false); }
  };

  return (
    <div className="pb-24 pt-2 space-y-4">
      {/* Header */}
      <section className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAvatar(true)} className="relative">
            <UserAvatar name={user?.displayName} seed={profile?.avatarSeed} size={48} className="border border-white/20 shadow-lg" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow"><Edit2 className="h-2.5 w-2.5" /></span>
          </button>
          <div>
            <h1 className="text-base font-extrabold tracking-tight leading-none">{user?.displayName || "Mi cuenta"}</h1>
            <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em] mt-0.5">{user?.email}</p>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full bg-white/40 h-8 w-8" onClick={openEdit}><Edit2 className="h-3 w-3 text-primary" /></Button>
      </section>

      {/* Nivel / Corona */}
      <div className="glass-card rounded-[1.8rem] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" style={{ color: lvl.current.color }} />
            <p className="text-sm font-extrabold text-on-surface">Nivel: {lvl.current.label}</p>
          </div>
          <span className="text-[10px] font-bold text-on-surface/40">{lvl.score} pts</span>
        </div>
        {/* Barra de tiers */}
        <div className="mt-4 flex items-center">
          {TIERS.map((t, i) => {
            const reached = score >= t.min;
            return (
              <div key={t.key} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2", reached ? "border-transparent" : "border-on-surface/15")} style={reached ? { background: t.color } : undefined}>
                    {reached && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={cn("mt-1 text-[8px] font-bold", reached ? "text-on-surface/70" : "text-on-surface/25")}>{t.label}</span>
                </div>
                {i < TIERS.length - 1 && <div className={cn("h-0.5 flex-1", score >= TIERS[i + 1].min ? "bg-primary" : "bg-on-surface/10")} />}
              </div>
            );
          })}
        </div>
        {lvl.next && <p className="mt-3 text-center text-[10px] text-on-surface/40">{lvl.next.min - score} pts para {lvl.next.label}</p>}
      </div>

      {/* Verificaciones */}
      <div className="glass-card rounded-[1.8rem] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-extrabold text-on-surface">{verifiedCount}/3 Verificaciones</p>
          <BadgeCheck className={verifiedCount === 3 ? "h-5 w-5 text-success" : "h-5 w-5 text-on-surface/30"} />
        </div>
        <VerifyRow icon={Mail} label="Verificar correo" done={emailVerified} action={!emailVerified ? verifyEmail : undefined} actionLabel="Enviar" />
        <VerifyRow icon={Phone} label="Registrar teléfono" done={phoneSet} action={!phoneSet ? openEdit : undefined} actionLabel="Agregar" />
        <VerifyRow icon={ShieldCheck} label="Completar perfil" done={profileComplete} />
      </div>

      {/* Contacto */}
      {(profile?.phone || profile?.whatsapp) && (
        <div className="glass-card rounded-[1.8rem] p-5 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Contacto</p>
          {profile?.phone && <p className="flex items-center gap-2 text-sm font-bold text-on-surface"><Phone className="h-4 w-4 text-primary" /> {profile.phone}</p>}
          {profile?.whatsapp && <p className="flex items-center gap-2 text-sm font-bold text-on-surface"><MessageCircle className="h-4 w-4 text-success" /> WhatsApp: {profile.whatsapp}</p>}
        </div>
      )}

      {/* Ver perfil público */}
      {user && (
        <Link href={`/u/${user.uid}`} className="no-underline">
          <div className="glass-card flex items-center justify-between rounded-2xl px-4 py-3 transition-all active:scale-[0.98]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10"><ExternalLink className="h-3.5 w-3.5 text-primary" /></div>
              <span className="text-[12px] font-bold tracking-tight text-on-surface">Ver mi perfil público</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-on-surface/25" />
          </div>
        </Link>
      )}

      {/* Settings */}
      <div className="space-y-1">
        <h2 className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.25em] px-3">Cuenta</h2>
        <div className="glass-card rounded-[2rem] overflow-hidden divide-y divide-white/10">
          <SettingRow icon={Lock} label="Contraseña" href="/perfil/password" />
          <SettingRow icon={Bell} label="Notificaciones" href="/perfil/notificaciones" />
          <SettingRow icon={CreditCard} label="Métodos de pago" href="/perfil/pagos" />
          <SettingRow icon={HelpCircle} label="Ayuda y soporte" href="/ayuda" />
          <SettingRow icon={LogOut} label="Cerrar sesión" destructive onClick={handleLogout} />
        </div>
      </div>

      {/* Avatar */}
      <Dialog open={showAvatar} onOpenChange={setShowAvatar}>
        <DialogContent className="glass-card rounded-[2.5rem] max-w-[340px] p-6 border-white/30">
          <DialogHeader><DialogTitle className="text-sm font-bold text-center">Elige tu avatar</DialogTitle></DialogHeader>
          <div className="grid grid-cols-4 gap-3 py-3">
            {AVATAR_SEEDS.map((seed) => {
              const activeA = profile?.avatarSeed === seed;
              return (
                <button key={seed} onClick={() => pickAvatar(seed)} disabled={saving} className={cn("relative rounded-2xl p-1 transition-all active:scale-90", activeA ? "ring-2 ring-primary" : "ring-1 ring-white/30")}>
                  <img src={avatarUrl(seed)} alt={seed} className="h-full w-full rounded-xl bg-white/60" />
                  {activeA && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white"><Check className="h-2.5 w-2.5" /></span>}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Editar perfil */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="glass-card rounded-[2.5rem] max-w-[340px] p-6 border-white/30 space-y-2">
          <DialogHeader><DialogTitle className="text-sm font-bold text-center">Editar perfil</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Nombre</Label><input value={name} onChange={(e) => setName(e.target.value)} className="glass-input w-full h-11 text-sm font-bold px-4" /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Teléfono</Label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej: 914146017" className="glass-input w-full h-11 text-sm font-bold px-4" /></div>
            <div className="space-y-1.5"><Label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">WhatsApp</Label><input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Ej: +51914146017" className="glass-input w-full h-11 text-sm font-bold px-4" /></div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" className="h-11 flex-1 rounded-2xl font-bold" onClick={() => setShowEdit(false)} disabled={saving}>Descartar</Button>
            <Button className="h-11 flex-1 rounded-2xl font-bold" onClick={saveProfile} disabled={saving}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VerifyRow({ icon: Icon, label, done, action, actionLabel }: { icon: any; label: string; done: boolean; action?: () => void; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/20 px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", done ? "text-success" : "text-on-surface/40")} />
        <span className="text-[12px] font-bold text-on-surface">{label}</span>
      </div>
      {done ? (
        <Check className="h-4 w-4 text-success" />
      ) : action ? (
        <button onClick={action} className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">{actionLabel}</button>
      ) : (
        <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface/30">Pendiente</span>
      )}
    </div>
  );
}

function SettingRow({ icon: Icon, label, href, onClick, destructive }: { icon: any; label: string; href?: string; onClick?: () => void; destructive?: boolean }) {
  const content = (
    <div className={cn("flex items-center justify-between py-2.5 px-3 transition-all active:bg-on-surface/[0.03] cursor-pointer", destructive ? "text-danger" : "text-on-surface")}>
      <div className="flex items-center gap-2.5">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 shadow-sm", destructive ? "bg-danger/5" : "bg-white/40")}>
          <Icon className={cn("h-3.5 w-3.5", destructive ? "text-danger" : "text-primary/60")} />
        </div>
        <span className="text-[12px] font-bold tracking-tight">{label}</span>
      </div>
      {href && <ChevronRight className="h-3 w-3 opacity-20" />}
    </div>
  );
  if (href) return <Link href={href} className="block">{content}</Link>;
  return <button onClick={onClick} className="block w-full text-left">{content}</button>;
}
