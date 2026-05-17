
"use client";

import { use, useState } from "react";
import { getSubscriptionById } from "@/lib/data";
import { notFound, useRouter } from "next/navigation";
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
import { CheckCircle, CreditCard, Landmark, Loader2, ArrowLeft } from "lucide-react";

export default function CheckoutPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "verifying" | "approved"
  >("idle");
  
  const subscription = getSubscriptionById(params.id);

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
            <Card className="rounded-3xl border-none shadow-lg">
                <CardHeader>
                    <div className="mx-auto bg-secondary/10 rounded-full p-6 w-fit">
                        <CheckCircle className="h-16 w-16 text-secondary" />
                    </div>
                    <CardTitle className="font-sora text-3xl pt-4 text-on-surface">¡Pago Aprobado!</CardTitle>
                    <CardDescription className="text-on-surface-variant">
                        Felicidades, ya eres parte del grupo de {subscription.service}. Recibirás los detalles de acceso por correo y en tu sección de Grupos.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full rounded-xl py-6 font-bold">
                    <a href="/mis-grupos">Ir a Mis Grupos</a>
                  </Button>
                </CardFooter>
            </Card>
       </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
       <div className="relative text-center mb-10">
         <Button onClick={() => router.back()} variant="outline" className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 p-0">
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-sora font-bold text-on-surface">
          Completar tu Compra
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="rounded-3xl border-outline-variant/30 shadow-sm overflow-hidden">
          <CardHeader className="flex-row items-center gap-4 bg-surface-container/50">
            {logo && (
              <Image
                src={logo.imageUrl}
                alt={logo.description}
                width={50}
                height={50}
                className="rounded-xl border border-outline-variant/30"
                data-ai-hint={logo.imageHint}
              />
            )}
            <div>
              <CardTitle className="font-sora text-xl text-on-surface">
                {subscription.service}
              </CardTitle>
              <CardDescription className="text-on-surface-variant">
                Anfitrión: {subscription.host}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-baseline border-t border-outline-variant/20 pt-4">
              <p className="text-on-surface-variant">Precio por cupo:</p>
              <p className="font-sora font-bold text-3xl text-primary">{subscription.currency}{subscription.price.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="peru" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-surface-container rounded-xl p-1 mb-6">
            <TabsTrigger value="peru" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-primary">
              <Landmark className="mr-2 h-4 w-4" /> Local
            </TabsTrigger>
            <TabsTrigger value="latam" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-primary">
              <CreditCard className="mr-2 h-4 w-4" /> Tarjeta
            </TabsTrigger>
          </TabsList>
          <TabsContent value="peru">
            <Card className="rounded-3xl border-outline-variant/30 shadow-sm">
              <CardHeader>
                <CardTitle className="font-sora">Depósito/Transferencia</CardTitle>
                <CardDescription>
                  Realiza el pago y pega el número de operación para verificar.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePeruSubmit}>
                <CardContent className="space-y-4">
                  <Alert variant="default" className="bg-primary/5 border-primary/20 rounded-2xl">
                      <AlertDescription className="space-y-2 text-sm text-on-surface">
                        <p><strong>Titular:</strong> Poolera SAC</p>
                        <p><strong>RUC:</strong> 20123456789</p>
                        <p><strong>Cuentas:</strong> Disponibles en la App</p>
                      </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="operation-number">Número de Operación</Label>
                    <Input id="operation-number" required className="rounded-xl border-outline-variant" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full rounded-xl py-6 text-lg font-bold active:scale-95 transition-all" disabled={paymentStatus === "verifying"}>
                    {paymentStatus === "verifying" ? (
                        <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verificando... </>
                    ) : 'Verificar Pago'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="latam">
            <Card className="rounded-3xl border-outline-variant/30 shadow-sm">
              <CardHeader>
                <CardTitle className="font-sora">Pasarela de Pagos</CardTitle>
                <CardDescription>
                  Paga de forma segura con tarjeta de crédito o débito.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-on-surface-variant">
                  Serás redirigido a la pasarela de pagos integrada para completar tu suscripción de forma segura.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-xl py-6 text-lg font-bold active:scale-95 transition-all" onClick={handleLatAmSubmit} disabled={paymentStatus === "verifying"}>
                  {paymentStatus === "verifying" ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</>
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
