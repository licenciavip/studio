"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useFirestore, useDoc, useCollection, useUser } from "@/firebase";
import { doc, collection, query, where, updateDoc, getDoc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Ban, ShieldCheck, Wallet as WalletIcon, CreditCard } from "lucide-react";
import { logAdminAction } from "@/lib/admin-log";
import { ENTITIES } from "@/lib/withdrawal";
import { AdminCard } from "@/components/admin/admin-ui";
import type { UserDoc, Wallet, WithdrawalAccount, GroupDoc, PaymentOrder, Withdrawal, Dispute } from "@/lib/types";

export default function AdminUserDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const firestore = useFirestore();
  const { user: admin, isAdmin } = useUser();
  const { toast } = useToast();

  const [showAdjust, setShowAdjust] = useState(false);
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const userRef = useMemo(() => (firestore ? doc(firestore, "users", id) : null), [firestore, id]);
  const { data: u } = useDoc<UserDoc>(userRef);

  const walletRef = useMemo(() => (firestore ? doc(firestore, "wallets", id) : null), [firestore, id]);
  const { data: wallet } = useDoc<Wallet>(walletRef);

  const q = (col: string, field: string) =>
    firestore ? query(collection(firestore, col), where(field, "==", id)) : null;

  const { data: accounts } = useCollection<WithdrawalAccount>(useMemo(() => q("withdrawalAccounts", "userId"), [firestore, id]));
  const { data: hosted } = useCollection<GroupDoc>(useMemo(() => q("groups", "hostId"), [firestore, id]));
  const { data: payments } = useCollection<PaymentOrder>(useMemo(() => q("paymentOrders", "userId"), [firestore, id]));
  const { data: withdrawals } = useCollection<Withdrawal>(useMemo(() => q("withdrawals", "userId"), [firestore, id]));
  const { data: disputes } = useCollection<Dispute>(useMemo(() => q("disputes", "userId"), [firestore, id]));

  const ensure = () => {
    if (!firestore || !admin || !isAdmin) { toast({ title: "No autorizado", variant: "destructive" }); return false; }
    return true;
  };

  const toggleBlock = async () => {
    if (!ensure() || !firestore || !admin || !u) return;
    setBusy(true);
    try {
      const next = !u.blocked;
      await updateDoc(doc(firestore, "users", id), { blocked: next });
      await logAdminAction(firestore, admin, next ? "user_blocked" : "user_unblocked", { targetUserId: id });
      toast({ title: next ? "Usuario bloqueado" : "Usuario desbloqueado" });
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setBusy(false); }
  };

  const adjustBalance = async () => {
    if (!ensure() || !firestore || !admin) return;
    const amount = parseFloat(delta);
    if (!amount) return;
    setBusy(true);
    try {
      const wr = doc(firestore, "wallets", id);
      const snap = await getDoc(wr);
      if (snap.exists()) {
        await updateDoc(wr, { balance: increment(amount), updatedAt: serverTimestamp() });
      } else {
        await setDoc(wr, { userId: id, balance: amount, currency: "PEN", updatedAt: serverTimestamp() });
      }
      await logAdminAction(firestore, admin, "balance_adjusted", { targetUserId: id, details: { amount, reason: reason.trim() } });
      toast({ title: "Saldo ajustado" });
      setShowAdjust(false); setDelta(""); setReason("");
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setBusy(false); }
  };

  const setAccountStatus = async (accountId: string, status: "approved" | "rejected") => {
    if (!ensure() || !firestore || !admin) return;
    setBusy(true);
    try {
      await updateDoc(doc(firestore, "withdrawalAccounts", accountId), { status, updatedAt: serverTimestamp() });
      await logAdminAction(firestore, admin, status === "approved" ? "withdrawal_account_approved" : "withdrawal_account_rejected", {
        targetUserId: id,
        resourceId: accountId,
      });
      toast({ title: status === "approved" ? "Cuenta aprobada" : "Cuenta rechazada" });
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setBusy(false); }
  };

  const Section = ({ title, count, children }: { title: string; count: number; children: React.ReactNode }) => (
    <div className="space-y-2">
      <p className="text-[11px] font-black uppercase tracking-widest text-white/40">{title} ({count})</p>
      {count === 0 ? <p className="text-[12px] text-white/25">—</p> : children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 text-white hover:bg-white/10">
          <Link href="/admin/usuarios"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">{u?.displayName || "Usuario"}</h1>
          <p className="text-[11px] text-white/40">{u?.email}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {u?.blocked && <span className="self-center rounded-full bg-danger/15 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-danger">Bloqueado</span>}
        </div>
      </div>

      {/* Billetera + acciones */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AdminCard>
          <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white/40"><WalletIcon className="h-3.5 w-3.5" /> Saldo</p>
          <p className="mt-1 text-3xl font-extrabold text-white">S/{(wallet?.balance ?? 0).toFixed(2)}</p>
          <Button className="mt-3 h-9 w-full rounded-xl bg-primary text-[12px] font-bold text-white hover:bg-primary/90" onClick={() => setShowAdjust(true)}>Ajustar saldo</Button>
        </AdminCard>
        <AdminCard className="flex flex-col justify-between">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40">Acciones</p>
          <Button
            className={u?.blocked ? "mt-3 h-9 w-full rounded-xl bg-success text-[12px] font-bold text-white" : "mt-3 h-9 w-full rounded-xl bg-danger text-[12px] font-bold text-white"}
            onClick={toggleBlock} disabled={busy}
          >
            {u?.blocked ? <><ShieldCheck className="mr-1 h-4 w-4" /> Desbloquear</> : <><Ban className="mr-1 h-4 w-4" /> Bloquear usuario</>}
          </Button>
        </AdminCard>
      </div>

      {/* Cuentas de retiro (KYC) */}
      <Section title="Cuentas de retiro" count={accounts?.length ?? 0}>
        <div className="space-y-2">
          {accounts?.map((a) => (
            <AdminCard key={a.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-white/40" /><div>
                <p className="text-sm font-bold text-white">{ENTITIES[a.entity]?.label} · {a.destination}</p>
                <p className="text-[11px] text-white/40">{a.holderName} · DNI {a.docNumber}</p>
              </div></div>
              {a.status === "pending" && (
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" className="h-8 rounded-lg bg-success px-3 text-[11px] font-bold text-white hover:bg-success/90" disabled={busy} onClick={() => setAccountStatus(a.id, "approved")}>Aprobar</Button>
                  <Button size="sm" variant="outline" className="h-8 rounded-lg border-danger/30 bg-transparent px-3 text-[11px] font-bold text-danger hover:bg-danger/10" disabled={busy} onClick={() => setAccountStatus(a.id, "rejected")}>Rechazar</Button>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      </Section>

      {/* Grupos como anfitrión */}
      <Section title="Grupos (anfitrión)" count={hosted?.length ?? 0}>
        <div className="space-y-2">
          {hosted?.map((g) => (
            <AdminCard key={g.id} className="flex items-center justify-between">
              <p className="text-sm font-bold text-white">{g.serviceName}</p>
              <p className="text-[11px] text-white/40">{g.slotsFilled}/{g.slotsTotal} · {g.approval}</p>
            </AdminCard>
          ))}
        </div>
      </Section>

      {/* Pagos */}
      <Section title="Pagos" count={payments?.length ?? 0}>
        <div className="space-y-2">
          {payments?.map((p) => (
            <AdminCard key={p.id} className="flex items-center justify-between">
              <p className="text-sm font-bold text-white">{p.type === "wallet_recharge" ? "Recarga" : "Membresía"} · {p.paymentCode}</p>
              <p className="text-[11px] text-white/40">S/{p.amountExpected.toFixed(2)} · {p.status}</p>
            </AdminCard>
          ))}
        </div>
      </Section>

      {/* Retiros */}
      <Section title="Retiros" count={withdrawals?.length ?? 0}>
        <div className="space-y-2">
          {withdrawals?.map((w) => (
            <AdminCard key={w.id} className="flex items-center justify-between">
              <p className="text-sm font-bold text-white">S/{w.amount.toFixed(2)} · {ENTITIES[w.entity]?.label}</p>
              <p className="text-[11px] text-white/40">{w.status}</p>
            </AdminCard>
          ))}
        </div>
      </Section>

      {/* Disputas */}
      <Section title="Disputas" count={disputes?.length ?? 0}>
        <div className="space-y-2">
          {disputes?.map((d) => (
            <AdminCard key={d.id} className="flex items-center justify-between">
              <p className="truncate pr-3 text-sm font-bold text-white">Orden {d.orderId}</p>
              <p className="text-[11px] text-white/40">{d.status}</p>
            </AdminCard>
          ))}
        </div>
      </Section>

      {/* Ajustar saldo */}
      <Dialog open={showAdjust} onOpenChange={setShowAdjust}>
        <DialogContent className="max-w-sm rounded-2xl border-white/10 bg-[#11151f] p-6 text-white">
          <DialogHeader><DialogTitle className="text-lg font-bold">Ajustar saldo</DialogTitle></DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Monto (use negativo para descontar)</Label>
              <input type="number" value={delta} onChange={(e) => setDelta(e.target.value)} placeholder="Ej: 10 o -10" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white outline-none" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Motivo</Label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ej: corrección manual" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white outline-none" />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" className="h-11 flex-1 rounded-xl border-white/15 bg-transparent font-bold text-white hover:bg-white/10" onClick={() => setShowAdjust(false)} disabled={busy}>Cancelar</Button>
            <Button className="h-11 flex-1 rounded-xl bg-primary font-bold text-white hover:bg-primary/90" onClick={adjustBalance} disabled={busy || !delta}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
