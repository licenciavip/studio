"use client";

import { PageHeader, EmptyState } from "@/components/admin/admin-ui";

export default function AdminSuscripcionesPage() {
  return (
    <div>
      <PageHeader title="Suscripciones" description="Grupos de suscripción activos en la plataforma." />
      <EmptyState
        title="Pendiente de conectar"
        description="Los grupos aún viven como datos de prueba. Cuando se migren a Firestore, se listarán aquí con su estado (activo, incompleto) y podrás suspenderlos."
      />
    </div>
  );
}
