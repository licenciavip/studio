"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// Firebase auth - will be connected later
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
  
  const user = { displayName: "Deyvid Poolera", email: "deyvid@poolera.com", photoURL: null };

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
        "flex items-center justify-between py-2 px-3 transition-all active:bg-on-surface/[0.03] cursor-pointer",
        destructive ? "text-red-500" : "text-on-surface"
      )}>
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 shadow-sm",
            destructive ? "bg-red-500/5" : "bg-white/40"
          )}>
            <Icon className={cn("h-3.5 w-3.5", destructive ? "text-red-500" : "text-primary/60")} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold tracking-tight">{label}</span>
            {value && <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{value}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {rightElement}
          {href && <ChevronRight className="h-3 w-3 opacity-20" />}
        </div>
      </div>
    );

    if (href) return <Link href={href} className="block">{content}</Link>;
    return content;
  };

  return (
    <div className="pb-24 pt-2 space-y-4">
      {/* Header Compacto Estilo Apple ID */}
      <section className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/20 shadow-lg">
            <Image 
              src={user?.photoURL || "https://picsum.photos/seed/user/200/200"} 
              alt={user?.displayName || "User"} 
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight leading-none">
              {user?.displayName || "Deyvid Poolera"}
            </h1>
            <p className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em] mt-0.5">
              Premium Member
            </p>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full bg-white/40 h-8 w-8 active:scale-90 transition-all">
          <Edit2 className="h-3 w-3 text-primary" />
        </Button>
      </section>

      {/* Ajustes Estilo iOS */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.25em] px-3">Seguridad</h2>
          <div className="glass-card rounded-[2rem] overflow-hidden divide-y divide-white/10">
            <SettingRow icon={Lock} label="Contraseña" href="/perfil/password" />
            <SettingRow 
              icon={Fingerprint} 
              label="Face ID" 
              rightElement={
                <div className="w-6 h-3.5 bg-primary/10 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>
              } 
            />
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
            <SettingRow icon={LogOut} label="Cerrar Sesión" destructive href="#" />
          </div>
        </div>
      </div>

      <div className="text-center pt-4 opacity-5">
        <p className="text-[8px] font-black uppercase tracking-[0.5em]">visionOS Framework v26.4</p>
      </div>
    </div>
  );
}
