"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Wallet, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BilleteraPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      toast({
        title: "Retiro solicitado",
        description: "Tu solicitud de retiro ha sido procesada y se completará en 24-48 horas."
      })
    }, 2000);
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-headline font-bold">Mi Billetera</h1>
        <p className="text-muted-foreground">Consulta tus saldos y solicita retiros.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Liberado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$150.75</div>
            <p className="text-xs text-muted-foreground">Disponible para retirar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Retenido (Escrow)</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45.50</div>
            <p className="text-xs text-muted-foreground">Pagos de ciclos activos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Solicitar Retiro</CardTitle>
          <CardDescription>
            Elige tu método de retiro preferido. El monto mínimo es $10.00.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="yape" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="yape">Yape (Perú)</TabsTrigger>
              <TabsTrigger value="wallet">Wallet (LatAm)</TabsTrigger>
            </TabsList>
            <form onSubmit={handleWithdraw}>
              <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto a retirar (USD)</Label>
                    <Input id="amount" type="number" placeholder="150.75" step="0.01" min="10" required />
                  </div>
                <TabsContent value="yape" className="m-0 p-0">
                    <div className="space-y-2">
                      <Label htmlFor="yape-phone">Número de Yape</Label>
                      <Input id="yape-phone" type="tel" placeholder="987654321" required/>
                    </div>
                </TabsContent>
                <TabsContent value="wallet" className="m-0 p-0">
                    <div className="space-y-2">
                      <Label htmlFor="wallet-address">Dirección de Wallet (USDT)</Label>
                      <Input id="wallet-address" placeholder="0x..." required/>
                    </div>
                </TabsContent>
                <Button type="submit" className="w-full mt-4" disabled={isWithdrawing}>
                  {isWithdrawing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isWithdrawing ? "Procesando..." : "Solicitar Retiro"}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
