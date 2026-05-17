
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { currentUser, walletTransactions } from "@/lib/data";
import { 
  Loader2, 
  Mail, 
  Smartphone, 
  Lock, 
  Fingerprint, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ExternalLink, 
  Edit2 
} from "lucide-react";

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
        <div className="relative overflow-hidden bg-primary-container p-8 rounded-3xl text-on-primary-container shadow-lg shadow-primary/20">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-2 uppercase tracking-wider">Saldo Disponible</p>
            <h1 className="text-6xl font-sora font-bold mb-8 tracking-tight">${currentUser.balance.toFixed(2)}</h1>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-surface-container-lowest text-primary rounded-xl px-6 py-3 h-auto font-bold flex items-center gap-2 hover:bg-white transition-all active:scale-95 shadow-sm">
                <span className="material-symbols-outlined">add_circle</span>
                Cargar Saldo
              </Button>
              <Button 
                variant="outline" 
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="bg-primary/20 border-on-primary-container/30 text-on-primary-container rounded-xl px-6 py-3 h-auto font-bold flex items-center gap-2 hover:bg-primary/30 transition-all active:scale-95"
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
            <h2 className="text-2xl font-sora font-bold text-on-surface">Actividad Reciente</h2>
            <button className="text-primary text-sm font-bold hover:underline">Ver todo</button>
          </div>
          
          <div className="space-y-3">
            {walletTransactions.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container text-primary">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{item.title}</p>
                    <p className="text-xs text-on-surface-variant">{item.category} • {item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${item.amount > 0 ? 'text-secondary' : 'text-error'}`}>
                    {item.amount > 0 ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
                  </p>
                  <span className="px-2 py-0.5 bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold rounded uppercase">Completado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Columna Derecha: Ajustes de Perfil */}
      <aside className="lg:col-span-5 space-y-6">
        {/* Card de Identidad */}
        <Card className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner relative border-2 border-primary-fixed">
              <Image 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-sora font-bold text-on-surface">{currentUser.name}</h3>
              <p className="text-xs font-medium text-on-surface-variant">Miembro desde {currentUser.memberSince}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full bg-surface-container text-primary hover:bg-primary-container hover:text-white transition-all">
              <Edit2 className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-on-surface">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <Smartphone className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-on-surface">{currentUser.phone}</span>
            </div>
          </div>
        </Card>

        {/* Grupos de Configuración */}
        <Card className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
          {/* Métodos de Pago */}
          <div className="p-6 border-b border-outline-variant/20">
            <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">Métodos de Pago</h4>
            <div className="space-y-3">
              {currentUser.paymentMethods.map(pm => (
                <div key={pm.id} className="flex items-center justify-between p-4 bg-surface border border-outline-variant/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-inverse-surface rounded flex items-center justify-center text-[8px] text-white font-bold tracking-tighter">{pm.type}</div>
                    <p className="text-sm font-bold text-on-surface">•••• {pm.last4}</p>
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase">Principal</span>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-2 rounded-xl py-6 text-on-surface-variant hover:text-primary hover:border-primary transition-all">
                <span className="material-symbols-outlined mr-2">add</span>
                Añadir nuevo método
              </Button>
            </div>
          </div>

          {/* Seguridad */}
          <div className="p-6 border-b border-outline-variant/20">
            <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">Seguridad</h4>
            <nav className="space-y-1">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-on-surface">Cambiar Contraseña</span>
                </div>
                <ChevronRight className="h-5 w-5 text-outline-variant" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-5 w-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-on-surface">Login Biométrico</span>
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
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-on-surface">Centro de Ayuda</span>
                </div>
                <ExternalLink className="h-5 w-5 text-outline-variant" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group text-error mt-2">
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
