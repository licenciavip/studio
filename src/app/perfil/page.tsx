"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { 
  Mail, 
  Smartphone, 
  Lock, 
  Fingerprint, 
  HelpCircle, 
  LogOut, 
  Edit2,
  ChevronRight,
  ShieldCheck,
  Bell,
  CreditCard,
  User
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
        "flex items-center justify-between py-3 px-4 transition-all active:bg-white/10",
        destructive ? "text-red-500" : "text-on-surface"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center border border-white/20",
            destructive ? "bg-red-500/10" : "bg-white/10"
          )}>
            <Icon className={cn("h-4 w-4", destructive ? "text-red-500" : "text-primary")} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-tight">{label}</span>
            {value && <span className="text-[9px] font-medium opacity-50 uppercase tracking-widest">{value}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {rightElement}
          {href && <ChevronRight className="h-3.5 w-3.5 opacity-30" />}
        </div>
      </div>
    );

    if (href) return <Link href={href} className="block">{content}</Link>;
    return content;
  };

  return (
    <div className="max-w-xl mx-auto pt-10 pb-24 px-4 space-y-6">
      {/* Mini Profile Header - Apple ID Style */}
      <section className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg">
            <Image 
              src={user?.photoURL || "https://picsum.photos/seed/user/200/200"} 
              alt={user?.displayName || "User"} 
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight leading-none mb-1">
              {user?.displayName || "Deyvid Poolera"}
            </h1>
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
              ID: {user?.uid.slice(0, 8).toUpperCase() || "SH-99283"}
            </p>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full bg-white/40 h-8 w-8">
          <Edit2 className="h-3.5 w-3.5 text-primary" />
        </Button>
      </section>

      {/* Account Info - Compact Grid */}
      <section className="grid grid-cols-2 gap-2">
        <div className="glass-card p-3 rounded-2xl">
          <p className="text-[8px] font-black text-on-surface-variant/30 uppercase tracking-[0.15em] mb-1">Email</p>
          <p className="text-[11px] font-bold truncate">{user?.email || "deyvid@poolera.com"}</p>
        </div>
        <div className="glass-card p-3 rounded-2xl">
          <p className="text-[8px] font-black text-on-surface-variant/30 uppercase tracking-[0.15em] mb-1">Teléfono</p>
          <p className="text-[11px] font-bold">+51 987 654 321</p>
        </div>
      </section>

      {/* Settings Groups - iOS Style Lists */}
      <div className="space-y-6">
        {/* Security Group */}
        <div className="space-y-1.5">
          <h2 className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest px-4">Seguridad</h2>
          <div className="glass-card rounded-[1.8rem] overflow-hidden divide-y divide-white/10">
            <SettingRow icon={Lock} label="Cambiar Contraseña" href="/perfil/password" />
            <SettingRow 
              icon={Fingerprint} 
              label="Acceso Biométrico" 
              rightElement={
                <div className="w-8 h-4 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                </div>
              } 
            />
            <SettingRow icon={ShieldCheck} label="Verificación en dos pasos" value="Activado" href="/perfil/2fa" />
          </div>
        </div>

        {/* Preferences Group */}
        <div className="space-y-1.5">
          <h2 className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest px-4">Preferencias</h2>
          <div className="glass-card rounded-[1.8rem] overflow-hidden divide-y divide-white/10">
            <SettingRow icon={Bell} label="Notificaciones" href="/perfil/notificaciones" />
            <SettingRow icon={CreditCard} label="Métodos de Pago" href="/perfil/pagos" />
          </div>
        </div>

        {/* Support & Legal */}
        <div className="space-y-1.5">
          <h2 className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest px-4">Soporte</h2>
          <div className="glass-card rounded-[1.8rem] overflow-hidden divide-y divide-white/10">
            <SettingRow icon={HelpCircle} label="Centro de Ayuda" href="/ayuda" />
            <SettingRow 
              icon={LogOut} 
              label="Cerrar Sesión" 
              destructive 
              href="#"
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4">
        <p className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.3em]">Poolera v2.0.1</p>
      </div>
    </div>
  );
}
