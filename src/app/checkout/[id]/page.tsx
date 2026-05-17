"use client";

import { use, useState, useEffect } from "react";
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
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Landmark, Loader2, ArrowLeft, Info, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

const BCP_ACCOUNT = {
  number: "191-987654321-0-12",
  cci: "002-191-009876543210-12",
  holder: "Poolera SAC",
  bank: "BCP"
};

export default function CheckoutPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const { toast } = useToast();
  const { authUser } = useAuth();
  const firestore = useFirestore();

  const [step, setState] = useState<"summary" | "instructions" | "register">("summary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentCode, setPaymentCode] = useState("");
  
  const subscription = getSubscriptionById(params.id);

  if (!subscription) {
    notFound();
  }

  const logo = PlaceHolderImages.find((img) => img.id === subscription.logoId);

  const generateOrder = async () => {
    if (!authUser || !firestore) {
      toast({ title: "Error", description: "Debes iniciar sesión para continuar.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    const code = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = doc(collection(firestore, "paymentOrders")).id;

    try {
      const orderData = {
        id: orderId,
        userId: authUser.uid,
        type: "membership_payment",
        relatedGroupId: subscription.id,
        amountExpected: subscription.price,
        currency: "USD",
        paymentCode: code,
        bankDestination: "BCP",
        destinationAccountNumber: BCP_ACCOUNT.number,
        status: "pending",
        reviewStatus: "waiting_upload",
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 horas
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(firestore, "paymentOrders", orderId), orderData);
      setPaymentCode(code);
      setState("instructions");
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "No se pudo generar la orden de pago.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: `${label} copiado al portapapeles.` });
  };

  if (step === "instructions") {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <Card className="rounded-3xl border-outline-variant/30 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary text-white text-center py-8">
            <div className="mx-auto bg-white/20 rounded-full p-4 w-fit mb-4">
              <Landmark className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="font-sora text-2xl">Instrucciones de Pago</CardTitle>
            <CardDescription className="text-white/80">Transferencia Directa BCP a BCP</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-4">
              <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                <span className="text-sm font-medium text-on-surface-variant">Monto a pagar:</span>
                <span className="text-2xl font-bold text-primary">${subscription.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                <span className="text-sm font-medium text-on-surface-variant">Código de pago:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary">{paymentCode}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(paymentCode, "Código")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Cuenta BCP soles:</span>
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-outline-variant">
                  <span className="font-mono text-sm">{BCP_ACCOUNT.number}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(BCP_ACCOUNT.number, "Cuenta")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-on-surface flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Pasos a seguir:
              </h4>
              <ul className="space-y-3 text-sm text-on-surface-variant">
                <li className="flex gap-3">
                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  Realiza la transferencia desde tu banca móvil por el monto **exacto**.
                </li>
                <li className="flex gap-3">
                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  Incluye el código **{paymentCode}** en la descripción si es posible.
                </li>
                <li className="flex gap-3">
                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  Toma una captura de pantalla clara del comprobante de éxito.
                </li>
              </ul>
            </div>

            <Alert className="bg-amber-50 border-amber-200 rounded-2xl">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-800">
                Los pagos se validan de 9:00 AM a 7:00 PM. Si pagas fuera de este horario, se procesará al día siguiente.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button className="w-full rounded-2xl py-6 font-bold shadow-lg" onClick={() => router.push('/billetera')}>
              Ya realicé el pago
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
          Confirmar Suscripción
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

        <Card className="rounded-3xl border-outline-variant/30 shadow-sm">
          <CardHeader>
            <CardTitle className="font-sora">Método de Pago</CardTitle>
            <CardDescription>Depósito o Transferencia BCP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="bg-primary/5 border-primary/20 rounded-2xl">
                <AlertDescription className="space-y-2 text-sm text-on-surface">
                  <p>Usaremos el sistema de validación manual de **Poolera**. Al continuar, verás los datos de la cuenta recaudadora.</p>
                </AlertDescription>
            </Alert>
            <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Transferencia BCP</p>
                <p className="text-xs text-on-surface-variant">Manual (aprobación en 2h-12h)</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full rounded-xl py-6 text-lg font-bold shadow-lg" onClick={generateOrder} disabled={isGenerating}>
              {isGenerating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generando...</> : "Obtener Datos de Pago"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}