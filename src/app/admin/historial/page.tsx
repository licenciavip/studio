"use client";

import { useMemo } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { PageHeader, AdminCard, EmptyState } from "@/components/admin/admin-ui";

interface AdminLog {
  id: string;
  action: string;
  adminEmail?: string | null;
  targetUserId?: string | null;
  resourceId?: string | null;
  createdAt?: { seconds: number } | null;
}

const actionLabels: Record<string, string> = {
  recharge_approved: "Recarga aprobada",
  recharge_rejected: "Recarga rechazada",
  payment_approved: "Pago aprobado",
  payment_rejected: "Pago rechazado",
  withdrawal_paid: "Retiro pagado",
  withdrawal_rejected: "Retiro rechazado",
  dispute_resolved: "Disputa resuelta",
  dispute_rejected: "Disputa rechazada",
  subscription_status_changed: "Suscripción modificada",
  user_blocked: "Usuario bloqueado",
  user_unblocked: "Usuario desbloqueado",
  balance_adjusted: "Saldo ajustado",
  service_created: "Servicio creado",
  service_updated: "Servicio actualizado",
  admin_permission_changed: "Permiso de admin cambiado",
};

export default function AdminHistorialPage() {
  const firestore = useFirestore();

  const logsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "adminLogs"), orderBy("createdAt", "desc"), limit(100));
  }, [firestore]);

  const { data: logs, loading } = useCollection<AdminLog>(logsQuery);

  const fmt = (ts?: { seconds: number } | null) =>
    ts ? new Date(ts.seconds * 1000).toLocaleString("es-PE") : "—";

  return (
    <div>
      <PageHeader title="Historial de acciones" description="Registro inmutable de las acciones administrativas." />

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando…</p>}
      {!loading && (logs?.length ?? 0) === 0 && (
        <EmptyState title="Sin acciones registradas" description="Cada aprobación, rechazo o cambio quedará registrado aquí." />
      )}

      <div className="space-y-2">
        {logs?.map((log) => (
          <AdminCard key={log.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">{actionLabels[log.action] || log.action}</p>
              <p className="text-[11px] text-white/40">por {log.adminEmail || "—"}</p>
            </div>
            <p className="text-[11px] text-white/40">{fmt(log.createdAt)}</p>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
