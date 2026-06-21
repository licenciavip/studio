import { cn } from "@/lib/utils";

/** Encabezado estándar de cada sección del panel. */
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-white">{title}</h1>
      {description && <p className="mt-1 text-sm text-white/45">{description}</p>}
    </div>
  );
}

/** Tarjeta base del panel (tema oscuro). */
export function AdminCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-5", className)}>
      {children}
    </div>
  );
}

/** Métrica para el resumen. */
export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <AdminCard>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">{value}</p>
      {hint && <p className="mt-1 text-[12px] text-white/40">{hint}</p>}
    </AdminCard>
  );
}

/** Estado vacío / pendiente de conectar a Firebase. */
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-16 text-center">
      <p className="text-sm font-bold text-white/60">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-[13px] text-white/35">{description}</p>}
    </div>
  );
}
