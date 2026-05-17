"use client";

import { useMemo, useState } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, getDoc, serverTimestamp, increment } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, ExternalLink, Loader2, Eye, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { PaymentOrder } from "@/lib/types";

export default function AdminPaymentsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Consulta de todas las órdenes de pago subidas o en revisión
  const paymentsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "paymentOrders"),
      orderBy("updatedAt", "desc")
    );
  }, [firestore]);

  const { data: payments, loading } = useCollection<PaymentOrder>(paymentsQuery);

  const handleApprove = async (order: PaymentOrder) => {
    if (!firestore) return;
    setIsProcessing(true);

    try {
      // 1. Actualizar orden
      const orderRef = doc(firestore, "paymentOrders", order.id);
      await updateDoc(orderRef, {
        status: "approved",
        reviewStatus: "approved",
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 2. Si es recarga, actualizar Wallet
      if (order.type === 'wallet_recharge') {
        const walletRef = doc(firestore, "wallets", order.userId);
        const walletSnap = await getDoc(walletRef);
        
        if (walletSnap.exists()) {
          await updateDoc(walletRef, {
            balance: increment(order.amountPaid || order.amountExpected),
            updatedAt: serverTimestamp()
          });
        } else {
          // Crear wallet si no existe (aunque debería existir por defecto)
          await updateDoc(walletRef, {
            userId: order.userId,
            balance: order.amountPaid || order.amountExpected,
            currency: order.currency,
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
      }

      toast({ title: "Pago Aprobado", description: `Se acreditó el monto al usuario.` });
      setSelectedOrder(null);
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "No se pudo procesar la aprobación.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder || !firestore) return;
    setIsProcessing(true);

    try {
      const orderRef = doc(firestore, "paymentOrders", selectedOrder.id);
      await updateDoc(orderRef, {
        status: "rejected",
        reviewStatus: "rejected",
        rejectedReason: rejectReason,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast({ title: "Pago Rechazado", description: "Se ha notificado al usuario." });
      setShowRejectDialog(false);
      setSelectedOrder(null);
      setRejectReason("");
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "No se pudo rechazar el pago.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <ShieldAlert className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-sora font-bold">Validación de Pagos</h1>
          <p className="text-muted-foreground text-sm font-medium">Panel Administrativo de Poolera</p>
        </div>
      </div>

      <Card className="rounded-3xl border-outline-variant/30 shadow-sm overflow-hidden">
        <CardHeader className="bg-surface-container/50">
          <CardTitle>Órdenes Pendientes de Revisión</CardTitle>
          <CardDescription>Revisa el número de operación y el comprobante antes de aprobar.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Fecha</TableHead>
                <TableHead>Código / Tipo</TableHead>
                <TableHead>Monto (Esp. vs Pag.)</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Cargando pagos...
                  </TableCell>
                </TableRow>
              )}
              {payments?.map((payment) => (
                <TableRow key={payment.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedOrder(payment)}>
                  <TableCell className="text-xs">
                    {payment.createdAt?.toDate().toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-sm">{payment.paymentCode}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-black">{payment.type}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-primary">${payment.amountExpected.toFixed(2)}</div>
                    <div className="text-[10px] text-muted-foreground">Pagado: ${payment.amountPaid?.toFixed(2) || "0.00"}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {payment.operationNumber || "---"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={payment.status === 'approved' ? 'default' : payment.status === 'pending' ? 'outline' : 'secondary'} className="rounded-full text-[10px]">
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && payments?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No hay solicitudes registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalle del Pago Seleccionado */}
      <Dialog open={!!selectedOrder && !showRejectDialog} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="rounded-3xl max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-sora">Detalle de Pago {selectedOrder?.paymentCode}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
            <div className="space-y-6">
              <div className="bg-surface-container rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-on-surface uppercase text-xs tracking-widest">Información Declarada</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase">Monto Esperado</p>
                    <p className="font-bold text-lg">${selectedOrder?.amountExpected.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase">Monto Pagado</p>
                    <p className="font-bold text-lg text-primary">${selectedOrder?.amountPaid?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase">Operación</p>
                    <p className="font-mono font-bold">{selectedOrder?.operationNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase">Banco Origen</p>
                    <p className="font-bold">{selectedOrder?.bankOrigin}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase">Nombre del Pagador</p>
                <p className="font-medium">{selectedOrder?.payerName || "No especificado"}</p>
              </div>

              {selectedOrder?.status === 'uploaded' && (
                <div className="flex gap-4 pt-4">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl py-6 font-bold" onClick={() => handleApprove(selectedOrder)}>
                    <Check className="mr-2 h-5 w-5" /> Aprobar Pago
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl py-6 font-bold" onClick={() => setShowRejectDialog(true)}>
                    <X className="mr-2 h-5 w-5" /> Rechazar
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase">Comprobante Adjunto</p>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-outline-variant/30 bg-muted">
                {selectedOrder?.proofImageUrl ? (
                  <Image src={selectedOrder.proofImageUrl} alt="Comprobante" fill className="object-contain p-2" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">Sin comprobante</div>
                )}
              </div>
              <Button variant="secondary" className="w-full rounded-xl" asChild>
                <a href={selectedOrder?.proofImageUrl} target="_blank"><ExternalLink className="mr-2 h-4 w-4" /> Ver imagen completa</a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Rechazo */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle>Rechazar Pago</DialogTitle>
            <DialogDescription>Indica el motivo del rechazo para informar al usuario.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Motivo del rechazo</Label>
            <Textarea 
              placeholder="Ej: El número de operación no coincide con el banco..." 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRejectDialog(false)}>Atrás</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason || isProcessing}>
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}