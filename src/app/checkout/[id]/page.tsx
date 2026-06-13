"use client";

import { use, useState } from "react";
import { getSubscriptionById } from "@/lib/data";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Landmark, Loader2, ArrowLeft, Info, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { BCP_ACCOUNT } from "@/lib/constants";

export default function CheckoutPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const { toast } = useToast();

  // ✅ FIX: hooks siempre antes de cualquier return condicional
  const auth = useAuth();
  const firestore = useFirestore();

  const [step, setStep] = useState<"summary" | "instructions">("summary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentCode, setPaymentCode] = useState("");

  // ✅ FIX: notFound() después de todos los hooks
  const subscription = getSubscriptionById(params.id);
  if (!subscription) notFound();

  const logo = PlaceHolderImages.find((img) => img.id === subscription!.logoId);

  const generateOrder = async () => {
    // ✅ FIX: auth.currentUser (consistente con el resto de la app)
    if (!auth.currentUser || !firestore) {
      toast({ title: "Error", description: "Debes iniciar sesión para continuar.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    const code = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = doc(collection(firestore, "paymentOrders")).id;
    try {
      await setDoc(doc(firestore, "paymentOrders", orderId), {
        id: orderId,
        userId: auth.currentUser.uid,
        type: "membership_payment",
        relatedGroupId: subscription!.id,
        amountExpected: subscription!.price,
        currency: "USD",
        paymentCode: code,
        bankDestination: BCP_ACCOUNT.bank,
        destinationAccountNumber: BCP_ACCOUNT.number,
        status: "pending",
        reviewStatus: "waiting_upload",
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setPaymentCode(code);
      setStep("instructions");
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
      <div className="pb-24 pt-2">
        <Card className="rounded-3xl shadow-xl overflow-hidden">
          <CardHeader className="bg-primary text-white text-center py-8">
            <div className="mx-auto bg-white/20 rounded-full p-4 w-fit mb-4">
              <Landmark className="h-10 w-10 text-white" />
            </div>
            <CardTitle>Instrucciones de Pago</CardTitle>
            <CardDescription className="text-white/80">Transferencia {BCP_ACCOUNT.bank}</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 space-y-4">
              <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                <span className="text-sm text-on-surface-variant">Monto a pagar:</span>
                <span className="text-2xl font-bold text-primary">${subscription!.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                <span className="text-sm text-on-surface-variant">Código de pago:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary">{paymentCode}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(paymentCode, "Código")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Cuenta {BCP_ACCOUNT.bank}:</span>
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border">
                  <span className="font-mono text-sm">{BCP_ACCOUNT.number}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(BCP_ACCOUNT.number, "Cuenta")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Alert className="bg-amber-50 border-amber-200 rounded-2xl">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-800">
                Los pagos se validan de 9:00 AM a 7:00 PM. Si pagas fuera de este horario, se procesará al día siguiente.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button className="w-full rounded-2xl py-6 font-bold shadow-lg" onClick={() => router.push("/billetera")}>
              <CheckCircle className="mr-2 h-5 w-5" /> Ya realicé el pago
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2">
      <div className="relative text-center mb-10">
        <Button onClick={() => router.back()} variant="outline" className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 p-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-on-surface">Confirmar Suscripción</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="rounded-3xl border-outline-variant/30 shadow-sm overflow-hidden">
          <CardHeader className="flex-row items-center gap-4 bg-surface-container/50">
            {logo && (
              <Image src={logo.imageUrl} alt={logo.description} width={50} height={50} className="rounded-xl border border-outline-variant/30" />
            )}
            <div>
              <CardTitle className="text-xl text-on-surface">{subscription!.service}</CardTitle>
              <CardDescription>Anfitrión: {subscription!.host}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-baseline border-t border-outline-variant/20 pt-4">
              <p className="text-on-surface-variant">Precio por cupo:</p>
              <p className="font-bold text-3xl text-primary">{subscription!.currency}{subscription!.price.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-outline-variant/30 shadow-sm">
          <CardHeader>
            <CardTitle>Método de Pago</CardTitle>
            <CardDescription>Depósito o Transferencia {BCP_ACCOUNT.bank}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Transferencia {BCP_ACCOUNT.bank}</p>
                <p className="text-xs text-on-surface-variant">Manual (aprobación en 2h-12h)</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full rounded-xl py-6 text-lg font-bold shadow-lg" onClick={generateOrder} disabled={isGenerating}>
              {isGenerating ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generando...</>
              ) : (
                "Obtener Datos de Pago"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
