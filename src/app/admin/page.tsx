"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { PageHeader, AdminCard } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";
import { Wallet, Send, BadgeCheck, Gavel, Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import type { PaymentOrder, Withdrawal, Dispute, GroupDoc } from "@/lib/types";

export default function AdminResumenPage() {
  const firestore = useFirestore();
  const qy = (name: string, field: string, val: string) =>
    firestore ? query(collection(firestore, name), where(field, "==", val)) : null;

  const { data: uploaded, loading } = useCollection<PaymentOrder>(useMemo(() => qy("paymentOrders", "status", "uploaded"), [firestore]));
  const { data: wPend } = useCollection<Withdrawal>(useMemo(() => qy("withdrawals", "status", "pending"), [firestore]));
  const { data: dOpen } = useCollection<Dispute>(useMemo(() => qy("disputes", "status", "open"), [firestore]));
  const { data: gPend } = useCollection<GroupDoc>(useMemo(() => qy("groups", "approval", "pending"), [firestore]));

  const recargas = (uploaded ?? []).filter((p) => p.type === "wallet_recharge").length;
  const pagos = (uploaded ?? []).filter((p) => p.type === "membership_payment").length;
  const retiros = (wPend ?? []).length;
  const disputas = (dOpen ?? []).length;
  const suscripciones = (gPend ?? []).length;
  const total = recargas + pagos + retiros + disputas + suscripciones;

  const items = [
    { label: "Recargas pendientes", count: recargas, href: "/admin/recargas", Icon: Wallet },
    { label: "Pagos de membresía", count: pagos, href: "/admin/pagos", Icon: BadgeCheck },
    { label: "Retiros por pagar", count: retiros, href: "/admin/retiros", Icon: Send },
    { label: "Disputas abiertas", count: disputas, href: "/admin/disputas", Icon: Gavel },
    { label: "Grupos por aprobar", count: suscripciones, href: "/admin/suscripciones", Icon: Layers },
  ].filter((i) => i.count > 0);

  return (
    <div>
      <PageHeader title="Resumen" description="Tareas que requieren tu atención." />

      {loading && <p className="py-4 text-center text-[13px] text-white/30">Cargando…</p>}

      {!loading && total === 0 && (
        <AdminCard className="flex flex-col items-center gap-2 border-success/20 bg-success/5 py-12">
          <CheckCircle2 className="h-10 w-10 text-success" />
          <p className="text-sm font-bold text-white">Todo al día</p>
          <p className="text-[12px] text-white/40">No hay tareas pendientes.</p>
        </AdminCard>
      )}

      <div className="space-y-2">
        {items.map(({ label, count, href, Icon }) => (
          <Link key={href} href={href} className="no-underline">
            <AdminCard className="flex items-center justify-between border-danger/20 transition-colors hover:bg-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/15 text-danger">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-white">{label}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-danger px-2 text-[11px] font-black text-white">{count}</span>
                <ArrowRight className="h-4 w-4 text-white/25" />
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
