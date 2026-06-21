'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

export interface UseUserResult {
  /** Usuario autenticado de Firebase, o null si no hay sesión. */
  user: User | null;
  /** true hasta que se resuelven la sesión Y las custom claims (evita parpadeos). */
  loading: boolean;
  /** true solo si el ID token trae la custom claim `admin: true`. Fuente de autorización. */
  isAdmin: boolean;
}

/**
 * Hook central de autenticación.
 *
 * `loading` permanece en true hasta que se conoce el usuario y se han leído sus
 * custom claims. Así los guards pueden decidir el destino correcto (/inicio vs
 * /admin) ANTES de renderizar, sin mostrar primero la pantalla equivocada.
 *
 * La autorización de administrador se basa en la custom claim `admin` del token
 * de Firebase Authentication, NO en un campo editable de Firestore.
 */
export function useUser(): UseUserResult {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser) {
        try {
          const tokenResult = await nextUser.getIdTokenResult();
          setIsAdmin(tokenResult.claims.admin === true);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setUser(nextUser);
      setLoading(false);
    });
  }, [auth]);

  return { user, loading, isAdmin };
}
