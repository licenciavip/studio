'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In development, Next.js will show the error overlay for uncaught errors.
      // We also show a toast for better visibility.
      toast({
        variant: 'destructive',
        title: 'Error de Permisos',
        description: `No tienes permisos para realizar esta operación en: ${error.context.path}`,
      });
      
      // Re-throw to trigger development overlay
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
