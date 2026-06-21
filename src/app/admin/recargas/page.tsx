"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { PageHeader, AdminCard, EmptyState } from "@/components/admin/admin-ui";
import { ArrowRight } from "lucide-react";
import type { PaymentOrder } from "@/lib/types";

export default function AdminRecargasPage() {
  const firestore = useFirestore();

  const rechargesQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "paymentOrders"),
      where("type", "==", "wallet_recharge"),
      where("status", "==", "uploaded"),
      orderBy("updatedAt", "desc")
    );
  }, [firestore]);

  const { data: recargas, loading } = useCollection<PaymentOrder>(rechargesQuery);

  return (
    <div>
      <PageHeader title="Recargas pendientes" description="Recargas de saldo enviadas que esperan validación." />

      {loading && <p className="py-10 text-center text-[13px] text-white/30">Cargando…</p>}
      {!loading && (recargas?.length ?? 0) === 0 && (
        <EmptyState title="Sin recargas pendientes" description="Las recargas por validar aparecerán aquí." />
      )}

      <div className="space-y-2">
        {recargas?.map((r) => (
          <Link key={r.id} href="/admin/pagos" className="no-underline">
            <AdminCard className="flex items-center justify-between transition-colors hover:bg-white/[0.06]">
              <div>
                <p className="text-sm font-bold text-white">{r.paymentCode}</p>
                <p className="text-[11px] text-white/40">N° op: {r.operationNumber || "—"}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-white">${r.amountExpected.toFixed(2)}</p>
                <ArrowRight className="h-4 w-4 text-white/30" />
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
