"use client";

import { PageHeader, EmptyState } from "@/components/admin/admin-ui";

export default function AdminReportesPage() {
  return (
    <div>
      <PageHeader title="Reportes" description="Métricas del negocio: ingresos, comisiones, GMV y usuarios." />
      <EmptyState
        title="Pendiente de conectar"
        description="Aquí irán los gráficos de ingresos, comisiones ganadas, volumen transado (GMV) y crecimiento de usuarios, calculados sobre los datos de Firestore."
      />
    </div>
  );
}
