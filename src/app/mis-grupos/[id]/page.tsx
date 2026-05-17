
"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Bell, 
  MessageCircle, 
  LogOut, 
  Mail, 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Info,
  UserPlus,
  BadgeCheck,
  Verified
} from "lucide-react";
import { groups, currentUser } from "@/lib/data";
import { notFound } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function GroupDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const group = groups.find(g => g.id === params.id);
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  if (!group) {
    notFound();
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles.`,
    });
  };

  const members = [
    { name: "Alex Chen", role: "Admin", joined: "Jan 2023", avatar: "https://picsum.photos/seed/alex/100/100" },
    { name: "Sarah Miller", role: "Member", joined: "Mar 2023", avatar: "https://picsum.photos/seed/sarah/100/100" },
    { name: "Jordan Lee", role: "Member", joined: "Jun 2023", avatar: "https://picsum.photos/seed/jordan/100/100" },
    { name: "Elena Rodriguez", role: "Member", joined: "Sep 2023", avatar: "https://picsum.photos/seed/elena/100/100" },
  ];

  return (
    <div className="max-w-[1280px] mx-auto space-y-8 py-8 px-margin-mobile">
      {/* TopAppBar */}
      <header className="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30 flex justify-between items-center w-full h-16 -mx-margin-mobile px-margin-mobile">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-surface-container active:scale-95 transition-all">
            <Link href="/mis-grupos">
              <ArrowLeft className="h-6 w-6 text-primary" />
            </Link>
          </Button>
          <span className="text-xl font-sora font-bold text-primary">Poolera</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-primary" />
          </Button>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
            <Image 
              src={currentUser.avatar} 
              alt="Profile" 
              width={32} 
              height={32} 
              className="object-cover"
            />
          </div>
        </div>
      </header>

      {/* Header Section: Bento Style */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Identity Card */}
        <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-surface-container flex items-center justify-center p-4">
            <div className="relative w-full h-full">
              <Image 
                src={`https://picsum.photos/seed/${group.id}/200/200`} 
                alt={group.service} 
                fill 
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-sora font-bold text-on-surface">{group.service}</h1>
              <span className="bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold border border-on-secondary-container/10">Activo</span>
            </div>
            <p className="text-on-surface-variant font-medium mb-6">Organizado por <span className="font-bold text-primary">{group.host}</span></p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Button className="bg-primary text-white rounded-full px-6 shadow-lg shadow-primary/20 hover:opacity-90">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Grupal
              </Button>
              <Button variant="outline" className="border-2 border-error text-error rounded-full px-6 hover:bg-error/5">
                <LogOut className="h-4 w-4 mr-2" />
                Salir del Grupo
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-primary-container text-white p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium opacity-80 mb-1">Tu Aporte</p>
            <h2 className="text-5xl font-sora font-bold leading-none">${group.publicPrice.toFixed(2)}<span className="text-lg font-medium opacity-70">/mes</span></h2>
          </div>
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-end">
              <span className="text-xs font-medium opacity-80 uppercase tracking-wider">Capacidad</span>
              <span className="text-sm font-bold">{group.slots.filled}/{group.slots.total} Cupos</span>
            </div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary-fixed rounded-full shadow-[0_0_8px_rgba(79,251,225,0.6)] transition-all duration-500" 
                style={{ width: `${(group.slots.filled / group.slots.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] font-bold opacity-80 text-right uppercase">Próximo Cobro: {group.nextBill}</p>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-sora font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">key</span>
          Credenciales de Acceso
        </h3>
        <div className="bg-white/50 backdrop-blur-md border border-primary/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[120px]">lock</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block ml-1">Email del Grupo</Label>
              <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-2xl border border-outline-variant focus-within:border-primary transition-all group">
                <Mail className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  className="bg-transparent border-none focus:ring-0 w-full text-sm font-bold text-on-surface" 
                  readOnly 
                  type="text" 
                  value={group.credentials.email} 
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-primary hover:bg-primary/10"
                  onClick={() => handleCopy(group.credentials.email, "Email")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block ml-1">Contraseña</Label>
              <div className="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-2xl border border-outline-variant focus-within:border-primary transition-all group">
                <Key className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  className="bg-transparent border-none focus:ring-0 w-full text-sm font-bold text-on-surface tracking-wider" 
                  readOnly 
                  type={showPassword ? "text" : "password"} 
                  value={group.credentials.pass} 
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-on-surface-variant"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-primary hover:bg-primary/10"
                  onClick={() => handleCopy(group.credentials.pass, "Contraseña")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 p-4 bg-tertiary-fixed/10 rounded-2xl border border-tertiary-fixed/20">
            <Info className="h-5 w-5 text-tertiary shrink-0" />
            <p className="text-xs font-medium text-tertiary">No cambies la contraseña. Hacerlo resultará en la expulsión inmediata del grupo sin reembolso.</p>
          </div>
        </div>
      </section>

      {/* Member List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-sora font-bold text-on-surface">Miembros Activos</h3>
          <Button variant="link" className="text-primary font-bold">
            Invitar Amigo
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
          {members.map((member, i) => (
            <div key={i} className="bg-surface-container-lowest p-4 rounded-3xl border border-outline-variant/30 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-variant">
                  <Image src={member.avatar} alt={member.name} width={48} height={48} className="object-cover" />
                </div>
                {member.role === "Admin" && (
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full border-2 border-surface-container-lowest">
                    <Verified className="h-3 w-3 fill-white text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-on-surface truncate">{member.name}</p>
                  {member.role === "Admin" && (
                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shrink-0">Host</span>
                  )}
                </div>
                <p className="text-[10px] text-on-surface-variant font-medium">Desde {member.joined}</p>
              </div>
            </div>
          ))}
          {/* Open Slot */}
          <div className="border-2 border-dashed border-outline-variant/50 p-4 rounded-3xl flex items-center gap-4 opacity-60 hover:opacity-100 hover:border-primary/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface-variant">Cupo Libre</p>
              <p className="text-[10px] font-bold text-primary uppercase">Invitar</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
