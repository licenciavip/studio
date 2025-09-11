"use client";

import { useState } from "react";
import { getSubscriptionById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, CreditCard, Landmark, Loader2 } from "lucide-react";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "verifying" | "approved"
  >("idle");
  const { id } = params;
  const subscription = getSubscriptionById(id);

  if (!subscription) {
    notFound();
  }

  const logo = PlaceHolderImages.find((img) => img.id === subscription.logoId);

  const handlePeruSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPaymentStatus("verifying");
    setTimeout(() => {
      setPaymentStatus("approved");
    }, 2000);
  };
  
  const handleLatAmSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPaymentStatus("verifying");
    setTimeout(() => {
      setPaymentStatus("approved");
    }, 2000);
  };


  if (paymentStatus === "approved") {
    return (
       <div className="container mx-auto max-w-2xl py-12 px-4 text-center">
            <Card>
                <CardHeader>
                    <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <CardTitle className="font-headline text-3xl pt-4">¡Pago Aprobado!</CardTitle>
                    <CardDescription>
                        Felicidades, ya eres parte del grupo de {subscription.service}. Recibirás los detalles de acceso por correo.
                    </CardDescription>
                </CardHeader>
            </Card>
       </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-headline font-bold text-center mb-8">
        Completar tu Compra
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader className="flex-row items-center gap-4">
            {logo && (
              <Image
                src={logo.imageUrl}
                alt={logo.description}
                width={50}
                height={50}
                className="rounded-lg border"
                data-ai-hint={logo.imageHint}
              />
            )}
            <div>
              <CardTitle className="font-headline text-2xl">
                {subscription.service}
              </CardTitle>
              <CardDescription>
                Anfitrión: {subscription.host}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline border-t pt-4">
              <p>Precio por cupo:</p>
              <p className="font-bold text-2xl">${subscription.price.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="peru" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="peru">
              <Landmark className="mr-2 h-4 w-4" /> Perú
            </TabsTrigger>
            <TabsTrigger value="latam">
              <CreditCard className="mr-2 h-4 w-4" /> LatAm
            </TabsTrigger>
          </TabsList>
          <TabsContent value="peru">
            <Card>
              <CardHeader>
                <CardTitle>Depósito/Transferencia</CardTitle>
                <CardDescription>
                  Realiza el pago y pega el número de operación para verificar.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePeruSubmit}>
                <CardContent className="space-y-4">
                  <Alert variant="default">
                      <AlertDescription className="space-y-2 text-sm">
                        <p><strong>BCP Soles:</strong> 191-12345678-0-99</p>
                        <p><strong>Interbank Soles:</strong> 003-876-0123456789</p>
                        <p><strong>Titular:</strong> CupoCompartido SAC</p>
                        <p><strong>RUC:</strong> 20123456789</p>
                      </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="operation-number">Número de Operación</Label>
                    <Input id="operation-number" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={paymentStatus === "verifying"}>
                    {paymentStatus === "verifying" ? (
                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando... </>
                    ) : 'Verificar Pago'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="latam">
            <Card>
              <CardHeader>
                <CardTitle>Pasarela de Pagos</CardTitle>
                <CardDescription>
                  Paga de forma segura con tarjeta de crédito o débito a través de nuestra pasarela.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Serás redirigido a Mercado Pago/PayU para completar tu pago de forma segura.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleLatAmSubmit} disabled={paymentStatus === "verifying"}>
                  {paymentStatus === "verifying" ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                  ) : 'Pagar con Pasarela'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
