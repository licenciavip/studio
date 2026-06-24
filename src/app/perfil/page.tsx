"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useFirestore, useDoc } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { AVATAR_SEEDS, avatarUrl } from "@/lib/avatars";
import {
  Lock, Fingerprint, HelpCircle, LogOut, Edit2, ChevronRight,
  ShieldCheck, Bell, CreditCard, ExternalLink, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicProfile } from "@/lib/types";

export default function PerfilPage() {
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [showAvatar, setShowAvatar] = useState(false);
  const [saving, setSaving] = useState(false);

  const profileRef = useMemo(
    () => (firestore && user ? doc(firestore, "publicProfiles", user.uid) : null),
    [firestore, user]
  );
  const { data: profile } = useDoc<PublicProfile>(profileRef);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Sesión cerrada" });
      router.push("/login");
    } catch {
      toast({ title: "Error", description: "No se pudo cerrar sesión.", variant: "destructive" });
    }
  };

  const pickAvatar = async (seed: string) => {
    if (!firestore || !user) return;
    setSaving(true);
    try {
      await setDoc(
        doc(firestore, "publicProfiles", user.uid),
        { uid: user.uid, displayName: user.displayName ?? "Usuario", avatarSeed: seed, updatedAt: serverTimestamp() },
        { merge: true }
      );
      toast({ title: "Avatar actualizado" });
      setShowAvatar(false);
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const SettingRow = ({ icon: Icon, label, value, href, onClick, destructive, rightElement }: {
    icon: any; label: string; value?: string; href?: string; onClick?: () => void; destructive?: boolean; rightElement?: React.ReactNode;
  }) => {
    const content = (
      <div className={cn("flex items-center justify-between py-2 px-3 transition-all active:bg-on-surface/[0.03] cursor-pointer", destructive ? "text-danger" : "text-on-surface")}>
        <div className="flex items-center gap-2.5">
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 shadow-sm", destructive ? "bg-danger/5" : "bg-white/40")}>
            <Icon className={cn("h-3.5 w-3.5", destructive ? "text-danger" : "text-primary/60")} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold tracking-tight">{label}</span>
            {value && <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{value}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">{rightElement}{href && <ChevronRight className="h-3 w-3 opacity-20" />}</div>
      </div>
    );
    if (href) return <Link href={href} className="block">{content}</Link>;
    if (onClick) return <button onClick={onClick} className="block w-full text-left">{content}</button>;
    return content;
  };

  return (
    <div className="pb-24 pt-2 space-y-4">
      {/* Header con avatar */}
      <section className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAvatar(true)} className="relative">
            <UserAvatar name={user?.displayName} seed={profile?.avatarSeed} size={48} className="border border-white/20 shadow-lg" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow">
              <Edit2 className="h-2.5 w-2.5" />
            </span>
          </button>
          <div>
            <h1 className="text-base font-extrabold tracking-tight leading-none">{user?.displayName || "Mi cuenta"}</h1>
            <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em] mt-0.5">{user?.email}</p>
          </div>
        </div>
      </section>

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

      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.25em] px-3">Seguridad</h2>
          <div className="glass-card rounded-[2rem] overflow-hidden divide-y divide-white/10">
            <SettingRow icon={Lock} label="Contraseña" href="/perfil/password" />
            <SettingRow icon={Fingerprint} label="Face ID" rightElement={<div className="w-6 h-3.5 bg-primary/10 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-primary rounded-full"></div></div>} />
            <SettingRow icon={ShieldCheck} label="2FA" value="Activado" href="/perfil/2fa" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.25em] px-3">Preferencias</h2>
          <div className="glass-card rounded-[2rem] overflow-hidden divide-y divide-white/10">
            <SettingRow icon={Bell} label="Notificaciones" href="/perfil/notificaciones" />
            <SettingRow icon={CreditCard} label="Métodos de Pago" href="/perfil/pagos" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.25em] px-3">Soporte</h2>
          <div className="glass-card rounded-[2rem] overflow-hidden divide-y divide-white/10">
            <SettingRow icon={HelpCircle} label="Ayuda y Soporte" href="/ayuda" />
            <SettingRow icon={LogOut} label="Cerrar Sesión" destructive onClick={handleLogout} />
          </div>
        </div>
      </div>

      {/* Selector de avatar */}
      <Dialog open={showAvatar} onOpenChange={setShowAvatar}>
        <DialogContent className="glass-card rounded-[2.5rem] max-w-[340px] p-6 border-white/30">
          <DialogHeader><DialogTitle className="text-sm font-bold text-center">Elige tu avatar</DialogTitle></DialogHeader>
          <div className="grid grid-cols-4 gap-3 py-3">
            {AVATAR_SEEDS.map((seed) => {
              const active = profile?.avatarSeed === seed;
              return (
                <button key={seed} onClick={() => pickAvatar(seed)} disabled={saving} className={cn("relative rounded-2xl p-1 transition-all active:scale-90", active ? "ring-2 ring-primary" : "ring-1 ring-white/30")}>
                  <img src={avatarUrl(seed)} alt={seed} className="h-full w-full rounded-xl bg-white/60" />
                  {active && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white"><Check className="h-2.5 w-2.5" /></span>}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
