'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { PaymentOrder } from '@/lib/types';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export function DisputeForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (evidence.trim().length < 10) {
      toast({ title: 'Evidencia muy corta', description: 'Describe tu caso con al menos 10 caracteres.', variant: 'destructive' });
      return;
    }
    if (!firestore || !user) return;
    setLoading(true);
    try {
      const orderSnap = await getDoc(doc(firestore, 'paymentOrders', orderId));
      const order = orderSnap.exists() ? (orderSnap.data() as PaymentOrder) : null;
      if (!order || order.userId !== user.uid || order.status !== 'approved') {
        toast({
          title: 'Orden no valida',
          description: 'Solo puedes abrir disputa sobre una orden aprobada propia.',
          variant: 'destructive',
        });
        return;
      }
      const id = doc(collection(firestore, 'disputes')).id;
      await setDoc(doc(firestore, 'disputes', id), {
        id,
        userId: user.uid,
        orderId,
        evidence: evidence.trim(),
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setDone(true);
    } catch {
      toast({ title: 'Error', description: 'No se pudo abrir la disputa.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-on-surface">Disputa enviada</h1>
        <p className="max-w-xs text-sm leading-relaxed text-on-surface/55">
          Recibimos tu caso. Nuestro equipo lo revisará y te daremos una respuesta pronto.
        </p>
        <Button className="h-11 w-full max-w-xs rounded-2xl font-bold" onClick={() => router.push('/mis-ordenes')}>
          Volver a mis órdenes
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-on-surface">Abrir disputa</h1>
          <p className="text-[11px] text-on-surface/40">Orden {orderId}</p>
        </div>
      </div>

      <div className="glass-card space-y-3 rounded-2xl p-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Describe tu problema</Label>
          <Textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={6}
            placeholder="Ej: El anfitrión me eliminó del grupo el día 15. Adjunto la captura del correo de notificación…"
            className="glass-input rounded-2xl text-sm"
          />
          <p className="text-[10px] text-on-surface/35">
            Incluye fechas y detalles. Si corresponde, recibirás un reembolso proporcional.
          </p>
        </div>
        <Button className="h-11 w-full rounded-2xl font-bold" onClick={handleSubmit} disabled={loading || evidence.trim().length < 10}>
          {loading ? 'Enviando…' : 'Abrir disputa'}
        </Button>
      </div>
    </div>
  );
}
