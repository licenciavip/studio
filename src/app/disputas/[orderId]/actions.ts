'use server';

import { disputeResolutionRecommendation } from '@/ai/flows/dispute-resolution-recommendation';
import { z } from 'zod';

export type State = {
  message: string;
  recommendation?: string | null;
  error?: string | null;
};

const schema = z.object({
  evidence: z.string().min(10, { message: 'La evidencia debe tener al menos 10 caracteres.' }),
  orderId: z.string(),
});

export async function createDispute(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = schema.safeParse({
    evidence: formData.get('evidence'),
    orderId: formData.get('orderId'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Error de validación.',
      error: validatedFields.error.flatten().fieldErrors.evidence?.[0] || 'Error desconocido.',
      recommendation: null,
    };
  }

  const { evidence, orderId } = validatedFields.data;

  try {
    // In a real app, you'd fetch real subscription and timing details based on orderId
    const mockInput = {
      evidence: evidence,
      subscriptionDetails: `Suscripción a Netflix Premium para la orden ${orderId}, costo mensual $9.99`,
      remainingTime: '15 días restantes de un ciclo de 30 días.',
    };

    const result = await disputeResolutionRecommendation(mockInput);
    
    return { 
        message: 'OK', 
        recommendation: result.recommendation,
        error: null,
    };
  } catch (e) {
    console.error(e);
    return { 
        message: 'Error de servidor.',
        error: 'Hubo un error al procesar la disputa con la IA.',
        recommendation: null,
     };
  }
}
