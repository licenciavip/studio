"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, HelpCircle, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "¿Cómo funcionan los pagos manuales?",
    a: "Debes realizar la transferencia a la cuenta BCP indicada y subir tu comprobante en la sección 'Billetera'. Nuestro equipo validará el pago en un máximo de 2 horas (dentro del horario operativo)."
  },
  {
    q: "¿Qué pasa si el anfitrión cambia la clave?",
    a: "Puedes abrir una disputa desde 'Mis Órdenes'. Nuestro sistema de IA analizará tu caso y, si se confirma el incumplimiento, recibirás un reembolso proporcional."
  },
  {
    q: "¿Cuál es el horario de validación?",
    a: "Validamos pagos de Lunes a Domingo de 9:00 AM a 7:00 PM (Hora Lima)."
  }
];

export default function AyudaPage() {
  return (
    <div className="pb-24 pt-2 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/perfil"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <h1 className="text-3xl font-sora font-bold">Centro de Ayuda</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-3xl border-outline-variant/30 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
              <MessageCircle className="h-6 w-6" />
            </div>
            <CardTitle>Soporte por Chat</CardTitle>
            <CardDescription>Habla con un agente en vivo para resolver dudas urgentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full rounded-xl">Iniciar Chat</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-outline-variant/30 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-2">
              <FileText className="h-6 w-6" />
            </div>
            <CardTitle>Documentación</CardTitle>
            <CardDescription>Guías detalladas sobre cómo compartir y unirse a grupos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full rounded-xl">Ver Guías</Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-sora font-bold px-1">Preguntas Frecuentes</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <Card key={i} className="rounded-2xl border-outline-variant/20 shadow-none bg-surface-container-lowest">
              <CardHeader className="p-4">
                <CardTitle className="text-base font-bold flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  {faq.q}
                </CardTitle>
                <CardDescription className="text-sm pt-2 leading-relaxed">
                  {faq.a}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 rounded-3xl p-8 text-center border border-primary/10">
        <h3 className="font-sora font-bold text-lg mb-2">¿Todavía tienes dudas?</h3>
        <p className="text-sm text-on-surface-variant mb-6">Estamos aquí para ayudarte a que tu experiencia sea increíble.</p>
        <Button variant="link" className="font-bold text-primary" asChild>
          <a href="mailto:soporte@subshare.com">Enviar un correo <ExternalLink className="h-4 w-4 ml-1" /></a>
        </Button>
      </div>
    </div>
  );
}
