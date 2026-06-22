"use client";

import { useMemo } from "react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { PageHeader, StatCard, AdminCard } from "@/components/admin/admin-ui";
import type { PaymentOrder, Wallet, Withdrawal, GroupDoc, ServiceDoc, UserDoc } from "@/lib/types";

export default function AdminReportesPage() {
  const firestore = useFirestore();
  const col = (name: string) => (firestore ? query(collection(firestore, name)) : null);

  const { data: users } = useCollection<UserDoc>(useMemo(() => col("users"), [firestore]));
  const { data: wallets } = useCollection<Wallet>(useMemo(() => col("wallets"), [firestore]));
  const { data: payments } = useCollection<PaymentOrder>(useMemo(() => col("paymentOrders"), [firestore]));
  const { data: withdrawals } = useCollection<Withdrawal>(useMemo(() => col("withdrawals"), [firestore]));
  const { data: groups } = useCollection<GroupDoc>(useMemo(() => col("groups"), [firestore]));
  const { data: services } = useCollection<ServiceDoc>(useMemo(() => col("services"), [firestore]));

  const m = useMemo(() => {
    const groupById = new Map((groups ?? []).map((g) => [g.id, g]));
    const feeByService = new Map((services ?? []).map((s) => [s.id, s.platformFee ?? 0]));

    const approvedPayments = (payments ?? []).filter((p) => p.status === "approved");
    const recharges = approvedPayments.filter((p) => p.type === "wallet_recharge");
    const memberships = approvedPayments.filter((p) => p.type === "membership_payment");

    const gmv = memberships.reduce((a, p) => a + (p.amountExpected || 0), 0);
    const totalRecharged = recharges.reduce((a, p) => a + (p.amountExpected || 0), 0);
    const walletLiability = (wallets ?? []).reduce((a, w) => a + (w.balance || 0), 0);

    // Comisión ganada: por cada membresía aprobada, fee del servicio del grupo.
    const commission = memberships.reduce((a, p) => {
      const g = p.relatedGroupId ? groupById.get(p.relatedGroupId) : undefined;
      const fee = g ? feeByService.get(g.serviceId) ?? 0 : 0;
      return a + fee;
    }, 0);

    const wPaid = (withdrawals ?? []).filter((w) => w.status === "paid").reduce((a, w) => a + w.amount, 0);
    const wPending = (withdrawals ?? []).filter((w) => w.status === "pending").reduce((a, w) => a + w.amount, 0);

    const activeGroups = (groups ?? []).filter((g) => g.approval === "approved");
    const slotsTotal = activeGroups.reduce((a, g) => a + g.slotsTotal, 0);
    const slotsFilled = activeGroups.reduce((a, g) => a + g.slotsFilled, 0);
    const pendingReview = (payments ?? []).filter((p) => p.status === "uploaded").length;

    return {
      users: users?.length ?? 0, gmv, commission, totalRecharged, walletLiability,
      wPaid, wPending, activeGroups: activeGroups.length, slotsTotal, slotsFilled, pendingReview,
    };
  }, [users, wallets, payments, withdrawals, groups, services]);

  return (
    <div>
      <PageHeader title="Reportes" description="Métricas del negocio en tiempo real." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Comisión ganada" value={`S/${m.commission.toFixed(2)}`} hint="De membresías aprobadas" />
        <StatCard label="GMV membresías" value={`S/${m.gmv.toFixed(2)}`} hint="Volumen transado" />
        <StatCard label="En billeteras" value={`S/${m.walletLiability.toFixed(2)}`} hint="Lo que debes a usuarios" />
        <StatCard label="Retiros pendientes" value={`S/${m.wPending.toFixed(2)}`} hint="Por pagar" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Usuarios" value={String(m.users)} />
        <StatCard label="Total recargado" value={`S/${m.totalRecharged.toFixed(2)}`} />
        <StatCard label="Retiros pagados" value={`S/${m.wPaid.toFixed(2)}`} />
        <StatCard label="Pagos por revisar" value={String(m.pendingReview)} />
      </div>

      <div className="mt-3">
        <AdminCard>
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40">Grupos activos y cupos</p>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-3xl font-extrabold text-white">{m.activeGroups}</p>
            <p className="text-sm text-white/50">{m.slotsFilled}/{m.slotsTotal} cupos ocupados</p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-success" style={{ width: `${m.slotsTotal ? (m.slotsFilled / m.slotsTotal) * 100 : 0}%` }} />
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
