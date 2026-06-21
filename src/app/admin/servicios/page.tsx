"use client";

import { servicesByCategory } from "@/lib/data";
import { PageHeader, AdminCard } from "@/components/admin/admin-ui";

export default function AdminServiciosPage() {
  const servicios = servicesByCategory.ia ?? [];

  return (
    <div>
      <PageHeader title="Servicios" description="Catálogo de plataformas disponibles para compartir." />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {servicios.map((s) => (
          <AdminCard key={s.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg" style={{ background: s.color || "#4343d5" }} />
              <div>
                <p className="text-sm font-bold text-white">{s.name}</p>
                <p className="text-[11px] text-white/40">{s.planName}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-white">S/{s.pricePerMonth}</p>
          </AdminCard>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-white/30">
        Catálogo actual (datos de prueba). La edición de precios, comisiones y alta/baja de servicios se conectará a Firestore.
      </p>
    </div>
  );
}
