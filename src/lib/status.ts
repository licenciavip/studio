import type { OrderStatus, PaymentOrderStatus } from "@/lib/types";

/**
 * Colores de estado unificados (semánticos iOS):
 * - success #30D158 → dinero liberado, pago aprobado, activo
 * - warning #FF9F0A → pendiente, retenido, en revisión
 * - danger  #FF453A → rechazado, disputa, error
 */

export const paymentStatusConfig: Record<
  PaymentOrderStatus,
  { label: string; text: string; badge: string }
> = {
  pending: {
    label: "Pendiente",
    text: "text-warning",
    badge: "bg-warning/10 text-warning border border-warning/20",
  },
  uploaded: {
    label: "En revisión",
    text: "text-warning",
    badge: "bg-warning/10 text-warning border border-warning/20",
  },
  under_review: {
    label: "En revisión",
    text: "text-warning",
    badge: "bg-warning/10 text-warning border border-warning/20",
  },
  approved: {
    label: "Aprobado",
    text: "text-success",
    badge: "bg-success/10 text-success border border-success/20",
  },
  rejected: {
    label: "Rechazado",
    text: "text-danger",
    badge: "bg-danger/10 text-danger border border-danger/20",
  },
  expired: {
    label: "Expirado",
    text: "text-on-surface/40",
    badge: "bg-on-surface/5 text-on-surface/40 border border-on-surface/10",
  },
  cancelled: {
    label: "Cancelado",
    text: "text-on-surface/40",
    badge: "bg-on-surface/5 text-on-surface/40 border border-on-surface/10",
  },
};

export const orderStatusConfig: Record<
  OrderStatus,
  { badge: string }
> = {
  "Activo": { badge: "bg-success/10 text-success border border-success/20" },
  "Pendiente": { badge: "bg-warning/10 text-warning border border-warning/20" },
  "En disputa": { badge: "bg-danger/10 text-danger border border-danger/20" },
  "Finalizado": { badge: "bg-on-surface/5 text-on-surface/40 border border-on-surface/10" },
};
