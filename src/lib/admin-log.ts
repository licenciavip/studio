import {
  addDoc,
  collection,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import type { User } from "firebase/auth";

/**
 * Acciones administrativas registrables. Mantener como unión de strings para
 * evitar typos y facilitar reportes/filtros.
 */
export type AdminActionType =
  | "recharge_approved"
  | "recharge_rejected"
  | "payment_approved"
  | "payment_rejected"
  | "withdrawal_paid"
  | "withdrawal_rejected"
  | "subscription_status_changed"
  | "user_blocked"
  | "user_unblocked"
  | "balance_adjusted"
  | "service_created"
  | "service_updated"
  | "admin_permission_changed";

export interface AdminLogInput {
  /** Usuario afectado por la acción, si aplica. */
  targetUserId?: string;
  /** Recurso afectado (id de pago, suscripción, servicio...), si aplica. */
  resourceId?: string;
  /** Datos relevantes: estado antes/después, montos, motivos, etc. */
  details?: Record<string, unknown>;
}

/**
 * Registra una acción administrativa en la colección `adminLogs`.
 *
 * Las reglas de Firestore solo permiten CREAR estos documentos a cuentas con la
 * custom claim `admin: true`, y prohíben actualizar/eliminar desde el cliente,
 * por lo que el registro es inmutable a nivel de backend.
 *
 * Debe llamarse DESPUÉS de que la operación principal se haya completado.
 */
export async function logAdminAction(
  firestore: Firestore,
  admin: Pick<User, "uid" | "email">,
  action: AdminActionType,
  input: AdminLogInput = {}
): Promise<void> {
  await addDoc(collection(firestore, "adminLogs"), {
    action,
    adminId: admin.uid,
    adminEmail: admin.email ?? null,
    targetUserId: input.targetUserId ?? null,
    resourceId: input.resourceId ?? null,
    details: input.details ?? null,
    createdAt: serverTimestamp(),
  });
}
