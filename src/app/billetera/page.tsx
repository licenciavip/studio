"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, PhoneIphone, Lock, Fingerprint, HelpCircle, LogOut, ChevronRight, ExternalLink, Edit2 } from "lucide-react";

export default function BilleteraPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      toast({
        title: "Retiro solicitado",
        description: "Tu solicitud de retiro ha sido procesada con éxito.",
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
      {/* Columna Izquierda: Sección de Billetera */}
      <section className="lg:col-span-7 space-y-8">
        {/* Card de Balance */}
        <div className="relative overflow-hidden bg-primary-container p-8 rounded-[2.5rem] text-white shadow-lg shadow-primary/20">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-2 uppercase tracking-wider">Saldo Disponible</p>
            <h1 className="text-6xl font-sora font-bold mb-8 tracking-tight">$142.50</h1>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-primary rounded-2xl px-6 py-6 h-auto font-bold flex items-center gap-2 hover:bg-white/90 transition-all active:scale-95">
                <span className="material-symbols-outlined">add_circle</span>
                Cargar Saldo
              </Button>
              <Button 
                variant="outline" 
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="bg-primary/20 border-white/30 text-white rounded-2xl px-6 py-6 h-auto font-bold flex items-center gap-2 hover:bg-primary/30 transition-all active:scale-95"
              >
                {isWithdrawing ? <Loader2 className="animate-spin h-5 w-5" /> : <span className="material-symbols-outlined">account_balance</span>}
                Retirar
              </Button>
            </div>
          </div>
          {/* Elemento decorativo de fondo */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Historial de Actividad */}
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-2xl font-sora font-bold text-foreground">Actividad Reciente</h2>
            <button className="text-primary text-sm font-bold hover:underline">Ver todo</button>
          </div>
          
          <div className="space-y-3">
            {[
              { title: "Netflix Premium Group", date: "Oct 12, 2023", amount: "-$4.50", type: "subscription", icon: "subscriptions" },
              { title: "Recarga de Billetera", date: "Oct 10, 2023", amount: "+$50.00", type: "topup", icon: "add_card" },
              { title: "Spotify Family Plan", date: "Oct 08, 2023", amount: "-$3.20", type: "subscription", icon: "music_note" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white border border-outline-variant/30 rounded-3xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-container text-primary">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${item.amount.startsWith('+') ? 'text-secondary' : 'text-destructive'}`}>
                    {item.amount}
                  </p>
                  <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary text-[10px] font-bold rounded uppercase">Completado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Columna Derecha: Ajustes de Perfil */}
      <aside className="lg:col-span-5 space-y-6">
        {/* Card de Identidad */}
        <Card className="bg-white border-outline-variant/30 rounded-[2.5rem] p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner relative">
              <Image 
                src="https://picsum.photos/seed/alex/200/200" 
                alt="Alex Thompson" 
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-sora font-bold text-foreground">Alex Thompson</h3>
              <p className="text-xs font-medium text-muted-foreground">Miembro desde Enero 2023</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-surface-container text-primary hover:bg-primary hover:text-white transition-all">
              <Edit2 className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">alex.t@example.com</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <PhoneIphone className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">+1 (555) 012-3456</span>
            </div>
          </div>
        </Card>

        {/* Grupos de Configuración */}
        <Card className="bg-white border-outline-variant/30 rounded-[2.5rem] overflow-hidden shadow-sm">
          {/* Métodos de Pago */}
          <div className="p-6 border-b border-outline-variant/20">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Métodos de Pago</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-surface border border-outline-variant/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-foreground rounded flex items-center justify-center text-[8px] text-white font-bold tracking-tighter">VISA</div>
                  <p className="text-sm font-bold text-foreground">•••• 4242</p>
                </div>
                <span className="text-[10px] font-bold text-primary uppercase">Principal</span>
              </div>
              <Button variant="outline" className="w-full border-dashed border-2 rounded-2xl py-6 text-muted-foreground hover:text-primary hover:border-primary transition-all">
                <span className="material-symbols-outlined mr-2">add</span>
                Añadir nuevo método
              </Button>
            </div>
          </div>

          {/* Seguridad */}
          <div className="p-6 border-b border-outline-variant/20">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Seguridad</h4>
            <nav className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors group">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Cambiar Contraseña</span>
                </div>
                <ChevronRight className="h-5 w-5 text-outline-variant" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors group">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Login Biométrico</span>
                </div>
                <div className="w-10 h-5 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </button>
            </nav>
          </div>

          {/* Soporte */}
          <div className="p-6">
            <nav className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors group">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">Centro de Ayuda</span>
                </div>
                <ExternalLink className="h-5 w-5 text-outline-variant" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors group text-destructive mt-2">
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-bold">Cerrar Sesión</span>
                </div>
              </button>
            </nav>
          </div>
        </Card>
      </aside>
    </div>
  );
}
