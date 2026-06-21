import type { WithdrawalEntity } from "@/lib/types";

interface EntityMeta {
  label: string;
  /** Etiqueta del campo destino según la entidad. */
  destinationLabel: string;
  destinationPlaceholder: string;
  color: string;
}

export const ENTITIES: Record<WithdrawalEntity, EntityMeta> = {
  yape: {
    label: "Yape",
    destinationLabel: "N° de celular vinculado",
    destinationPlaceholder: "Ej: 912345678",
    color: "#742384",
  },
  plin: {
    label: "Plin",
    destinationLabel: "N° de celular vinculado",
    destinationPlaceholder: "Ej: 912345678",
    color: "#00BCD4",
  },
  bcp: {
    label: "BCP",
    destinationLabel: "N° de cuenta o CCI",
    destinationPlaceholder: "Ej: 191-1234567890-0-12",
    color: "#0a3d91",
  },
};

export const ENTITY_LIST: WithdrawalEntity[] = ["yape", "bcp", "plin"];
