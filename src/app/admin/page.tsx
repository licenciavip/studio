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
  ];

  return (
    <div>
      <PageHeader title="Resumen" description="Todo lo que requiere tu atención." />

      {/* Total pendiente */}
      <AdminCard className={cn("mb-4 flex items-center justify-between", total > 0 ? "border-danger/30 bg-danger/5" : "border-success/20 bg-success/5")}>
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40">Total pendiente</p>
          <p className={cn("mt-1 text-3xl font-extrabold", total > 0 ? "text-danger" : "text-success")}>{total}</p>
        </div>
        {total === 0 ? <CheckCircle2 className="h-10 w-10 text-success" /> : <span className="text-[11px] font-bold text-white/50">acciones por hacer</span>}
      </AdminCard>

      {loading && <p className="py-4 text-center text-[13px] text-white/30">Cargando…</p>}

      <div className="space-y-2">
        {items.map(({ label, count, href, Icon }) => (
          <Link key={href} href={href} className="no-underline">
            <AdminCard className={cn("flex items-center justify-between transition-colors hover:bg-white/[0.06]", count > 0 && "border-danger/20")}>
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", count > 0 ? "bg-danger/15 text-danger" : "bg-white/[0.05] text-white/40")}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-white">{label}</p>
              </div>
              <div className="flex items-center gap-2">
                {count > 0 ? (
                  <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-danger px-2 text-[11px] font-black text-white">{count}</span>
                ) : (
                  <span className="text-[11px] font-bold text-white/30">0</span>
                )}
                <ArrowRight className="h-4 w-4 text-white/25" />
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
