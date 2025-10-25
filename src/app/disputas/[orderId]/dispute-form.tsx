'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { createDispute } from './actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Loader2 } from 'lucide-react';

const initialState: {
  message: string;
  recommendation?: string | null;
  error?: string | null;
} = {
  message: '',
  recommendation: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Enviando...' : 'Abrir Disputa'}
    </Button>
  );
}

export function DisputeForm({ orderId }: { orderId: string }) {
  const [state, formAction] = useFormState(createDispute, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === 'OK' && state.recommendation) {
        toast({
            title: "Disputa recibida",
            description: "Hemos recibido tu disputa y la IA ha generado una recomendación.",
        });
        formRef.current?.reset();
    } else if (state.message === 'Error de servidor' && state.error) {
      toast({
        variant: 'destructive',
        title: 'Error del Servidor',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Abrir Disputa</CardTitle>
        <CardDescription>
          Describe tu problema y proporciona evidencia. Nuestro sistema de IA analizará el caso y
          propondrá un reembolso proporcional si corresponde.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <input type="hidden" name="orderId" value={orderId} />
          <div className="space-y-2">
            <Label htmlFor="evidence">Evidencia</Label>
            <Textarea
              id="evidence"
              name="evidence"
              placeholder="Ej: El anfitrión me eliminó del grupo de Netflix el día 15 del mes. Adjunto como prueba la captura de pantalla del correo de notificación..."
              rows={6}
              required
            />
            {state.message === 'Error de validación' && state.error && (
                 <p className="text-sm font-medium text-destructive">{state.error}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
      {state.recommendation && state.message === 'OK' && (
        <div className="p-6 pt-0">
          <Alert className="bg-primary/10 border-primary/50">
            <Bot className="h-4 w-4 !text-primary" />
            <AlertTitle className="text-primary font-semibold">Recomendación de la IA</AlertTitle>
            <AlertDescription className="text-primary/90">
              {state.recommendation}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}
