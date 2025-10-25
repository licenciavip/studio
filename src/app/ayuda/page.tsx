import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export default function AyudaPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-8">
        <LifeBuoy className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-headline font-bold">Centro de Ayuda</h1>
        <p className="text-muted-foreground">
          ¿Tienes preguntas? Estamos aquí para ayudarte.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preguntas Frecuentes (FAQ)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">¿Cómo funciona Poolera?</h3>
            <p className="text-muted-foreground">
              Nuestra plataforma conecta a personas que quieren compartir los gastos de sus suscripciones digitales. Puedes ofrecer los cupos que no usas o unirte a grupos ya existentes para ahorrar dinero.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">¿Es seguro compartir mi suscripción?</h3>
            <p className="text-muted-foreground">
              Sí. Actuamos como intermediarios y retenemos el pago (escrow) para garantizar que tanto anfitriones como miembros estén protegidos. No compartimos información sensible como contraseñas.
            </p>
          </div>
           <div className="space-y-2">
            <h3 className="font-semibold">¿Qué pasa si me eliminan de un grupo?</h3>
            <p className="text-muted-foreground">
              Si te eliminan antes de que termine el ciclo de facturación, puedes abrir una disputa. Nuestro sistema de IA y nuestro equipo de soporte analizarán el caso para determinar un reembolso proporcional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
