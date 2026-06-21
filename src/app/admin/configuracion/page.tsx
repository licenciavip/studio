"use client";

import { PageHeader, AdminCard } from "@/components/admin/admin-ui";
import { BCP_ACCOUNT } from "@/lib/constants";

export default function AdminConfiguracionPage() {
  return (
    <div>
      <PageHeader title="Configuración" description="Parámetros del negocio." />

      <div className="space-y-3">
        <AdminCard>
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40">Cuenta de cobro</p>
          <div className="mt-2 space-y-1 text-sm text-white">
            <p><span className="text-white/40">Banco:</span> {BCP_ACCOUNT.bank}</p>
            <p><span className="text-white/40">Titular:</span> {BCP_ACCOUNT.holder}</p>
            <p><span className="text-white/40">Cuenta:</span> <span className="font-mono">{BCP_ACCOUNT.number}</span></p>
            <p><span className="text-white/40">CCI:</span> <span className="font-mono">{BCP_ACCOUNT.cci}</span></p>
          </div>
        </AdminCard>

        <AdminCard>
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40">Pendiente de conectar</p>
          <p className="mt-2 text-[13px] text-white/50">
            Comisión de la plataforma, horarios de validación, reglas de reembolso y cuentas por país se editarán aquí cuando se guarden en Firestore.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
