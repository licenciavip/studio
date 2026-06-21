"use client";

import { useMemo } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { paymentStatusConfig } from "@/lib/status";
import type { PaymentOrder } from "@/lib/types";

const toMs = (v: unknown): number =>
  v && typeof v === "object" && "seconds" in v ? (v as { seconds: number }).seconds * 1000 : 0;

export default function MisOrdenesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const ordersQuery = useMemo(
    () => (firestore && user ? query(collection(firestore, "paymentOrders"), where("userId", "==", user.uid)) : null),
    [firestore, user]
  );
  const { data: raw, loading } = useCollection<PaymentOrder>(ordersQuery);

  const orders = useMemo(
    () =>
      [...(raw ?? [])]
        .filter((o) => o.type === "membership_payment")
        .sort((a, b) => toMs(b.updatedAt) - toMs(a.updatedAt)),
    [raw]
  );

  return (
    <div className="pb-24 pt-2 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tighter">Historial</h1>
        <p className="text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">Tus pagos de membresías</p>
      </div>

      {loading && <p className="py-10 text-center text-[10px] font-black uppercase tracking-widest text-on-surface/30">Cargando…</p>}

      {!loading && orders.length === 0 && (
        <div className="glass-card rounded-[2rem] py-16 text-center border-dashed border-primary/10">
          <p className="text-[10px] font-bold text-on-surface/30 uppercase tracking-[0.2em]">Sin órdenes</p>
          <Link href="/explorar" className="mt-2 inline-block text-[11px] font-bold uppercase tracking-tight text-primary">Explorar cupos</Link>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => {
          const cfg = paymentStatusConfig[order.status];
          return (
            <div key={order.id} className="glass-card p-4 rounded-[1.8rem] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface tracking-tight">Membresía</h3>
                  <p className="text-[9px] font-medium text-on-surface/40 uppercase tracking-widest">{order.paymentCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tracking-tight">S/{order.amountExpected.toFixed(2)}</p>
                <span className={cn("text-[9px] font-black uppercase tracking-widest", cfg?.text)}>{cfg?.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
