"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { PageHeader, StatCard, AdminCard } from "@/components/admin/admin-ui";
import { paymentStatusConfig } from "@/lib/status";
import { ArrowRight } from "lucide-react";
import type { PaymentOrder } from "@/lib/types";

export default function AdminResumenPage() {
  const firestore = useFirestore();

  const paymentsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "paymentOrders"), orderBy("updatedAt", "desc"));
  }, [firestore]);

  const { data: payments, loading } = useCollection<PaymentOrder>(paymentsQuery);

  const pendientes = payments?.filter((p) => p.status === "uploaded") ?? [];
  const aprobados = payments?.filter((p) => p.status === "approved") ?? [];
  const recargasPend = pendientes.filter((p) => p.type === "wallet_recharge");
  const totalAprobado = aprobados.reduce((acc, p) => acc + (p.amountPaid || p.amountExpected || 0), 0);

  return (
    <div>
      <PageHeader title="Resumen general" description="Vista rápida del estado de la plataforma." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Pagos por revisar" value={loading ? "…" : String(pendientes.length)} hint="Requieren tu validación" />
        <StatCard label="Recargas pendientes" value={loading ? "…" : String(recargasPend.length)} />
        <StatCard label="Pagos aprobados" value={loading ? "…" : String(aprobados.length)} />
        <StatCard label="Total acreditado" value={loading ? "…" : `S/${totalAprobado.toFixed(2)}`} />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-white/50">Pagos por revisar</h2>
          <Link href="/admin/pagos" className="flex items-center gap-1 text-xs font-bold text-primary no-underline">
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading && <p className="py-8 text-center text-[13px] text-white/30">Cargando…</p>}
        {!loading && pendientes.length === 0 && (
          <AdminCard><p className="text-center text-[13px] text-white/40">No hay pagos pendientes de revisión.</p></AdminCard>
        )}
        <div className="space-y-2">
          {pendientes.slice(0, 5).map((p) => {
            const cfg = paymentStatusConfig[p.status];
            return (
              <Link key={p.id} href="/admin/pagos" className="no-underline">
                <AdminCard className="flex items-center justify-between transition-colors hover:bg-white/[0.06]">
                  <div>
                    <p className="text-sm font-bold text-white">{p.paymentCode}</p>
                    <p className="text-[11px] uppercase tracking-wide text-white/40">{p.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">S/{p.amountExpected.toFixed(2)}</p>
                    <span className="text-[10px] font-black uppercase tracking-widest text-warning">{cfg?.label}</span>
                  </div>
                </AdminCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
