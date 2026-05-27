"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { 
  Lock, 
  Fingerprint, 
  HelpCircle, 
  LogOut, 
  Edit2,
  ChevronRight,
  ShieldCheck,
  Bell,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
  const auth = useAuth();
  const user = auth?.currentUser;

  const SettingRow = ({ 
    icon: Icon, 
    label, 
    value, 
    href, 
    destructive,
    rightElement 
  }: { 
    icon: any, 
    label: string, 
    value?: string, 
    href?: string,
    destructive?: boolean,
    rightElement?: React.ReactNode
  }) => {
    const content = (
      <div className={cn(
        "flex items-center justify-between py-2.5 px-4 transition-all active:bg-white/5",
        destructive ? "text-red-500" : "text-on-surface"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center border border-white/10",
            destructive ? "bg-red-500/5" : "bg-white/5"
          )}>
            <Icon className={cn("h-3.5 w-3.5", destructive ? "text-red-500" : "text-primary/60")} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-tight">{label}</span>
            {value && <span className="text-[8px] font-medium opacity-40 uppercase tracking-widest">{value}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {rightElement}
          {href && <ChevronRight className="h-3 w-3 opacity-20" />}
        </div>
      </div>
    );

    if (href) return <Link href={href} className="block">{content}</Link>;
    return content;
  };

  return (
    <div className="max-w-xl mx-auto pt-10 pb-24 px-4 space-y-6">
      {/* Profile Header Compacto visionOS */}
      <section className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 shadow-lg">
            <Image 
              src={user?.photoURL || "https://picsum.photos/seed/user/200/200"} 
              alt={user?.displayName || "User"} 
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tighter leading-none mb-0.5">
              {user?.displayName || "Deyvid Poolera"}
            </h1>
            <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest">
              ID: {user?.uid.slice(0, 6).toUpperCase() || "SH-992"}
            </p>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full bg-white/10 h-8 w-8">
          <Edit2 className="h-3 w-3 text-primary" />
        </Button>
      </section>

      {/* Settings Groups Estilo iOS Settings */}
      <div className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em] px-4">Seguridad</h2>
          <div className="glass-card rounded-[1.8rem] overflow-hidden divide-y divide-white/5">
            <SettingRow icon={Lock} label="Contraseña" href="/perfil/password" />
            <SettingRow 
              icon={Fingerprint} 
              label="Biometría" 
              rightElement={
                <div className="w-7 h-3.5 bg-primary/20 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
              } 
            />
            <SettingRow icon={ShieldCheck} label="2FA" value="Activado" href="/perfil/2fa" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em] px-4">Preferencias</h2>
          <div className="glass-card rounded-[1.8rem] overflow-hidden divide-y divide-white/5">
            <SettingRow icon={Bell} label="Notificaciones" href="/perfil/notificaciones" />
            <SettingRow icon={CreditCard} label="Pagos" href="/perfil/pagos" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em] px-4">Cuenta</h2>
          <div className="glass-card rounded-[1.8rem] overflow-hidden divide-y divide-white/5">
            <SettingRow icon={HelpCircle} label="Ayuda" href="/ayuda" />
            <SettingRow icon={LogOut} label="Cerrar Sesión" destructive href="#" />
          </div>
        </div>
      </div>

      <div className="text-center pt-4 opacity-10">
        <p className="text-[8px] font-black uppercase tracking-[0.3em]">Poolera OS v2.6</p>
      </div>
    </div>
  );
}