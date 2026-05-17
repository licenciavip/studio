"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function BilleteraPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      toast({
        title: "Retiro solicitado",
        description: "Tu solicitud de retiro ha sido procesada.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <section>
        <div className="relative overflow-hidden bg-primary-container p-8 rounded-[2.5rem] text-primary-foreground shadow-lg shadow-primary/20">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-2">Saldo Disponible</p>
            <h1 className="text-6xl font-headline font-bold mb-8 tracking-tight">$142.50</h1>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-primary rounded-2xl px-6 py-6 h-auto font-bold flex items-center gap-2 hover:bg-white/90">
                <span className="material-symbols-outlined">add_circle</span>
                Cargar Saldo
              </Button>
              <Button 
                variant="outline" 
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="bg-primary/20 border-white/30 text-white rounded-2xl px-6 py-6 h-auto font-bold flex items-center gap-2"
              >
                {isWithdrawing ? <Loader2 className="animate-spin" /> : <span className="material-symbols-outlined">account_balance</span>}
                Retirar
              </Button>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Activity Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-2xl font-headline font-bold text-foreground">Actividad Reciente</h2>
          <button className="text-primary text-sm font-bold hover:underline">Ver todo</button>
        </div>
        
        <div className="space-y-3">
          {[
            { title: "Netflix Premium Group", date: "Oct 12, 2023", amount: "-$4.50", type: "error" },
            { title: "Recarga de Billetera", date: "Oct 10, 2023", amount: "+$50.00", type: "secondary" },
            { title: "Spotify Family Plan", date: "Oct 08, 2023", amount: "-$3.20", type: "error" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border border-outline-variant/30 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-container text-primary">
                  <span className="material-symbols-outlined">{i === 1 ? 'add_card' : 'subscriptions'}</span>
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
      </section>

      {/* Profile/Settings Aside Preview */}
      <section className="bg-white border border-outline-variant/30 rounded-[2.5rem] p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner">
            <Image 
              src="https://picsum.photos/seed/alex/200/200" 
              alt="Alex Thompson" 
              width={64} 
              height={64} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-headline font-bold text-foreground">Alex Thompson</h3>
            <p className="text-xs text-muted-foreground">Miembro desde Enero 2023</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-surface-container text-primary">
            <span className="material-symbols-outlined">edit</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-outline group-hover:text-primary">mail</span>
            <span className="text-sm font-medium text-foreground">alex.t@example.com</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-surface border border-outline-variant/20 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-foreground rounded flex items-center justify-center text-[8px] text-white font-bold tracking-tighter">VISA</div>
              <p className="text-sm font-bold text-foreground">•••• 4242</p>
            </div>
            <span className="text-[10px] font-bold text-primary uppercase">Principal</span>
          </div>
        </div>
      </section>
    </div>
  );
}
