/**
 * Sistema de niveles (gamificación tipo "corona").
 * El puntaje suma: antigüedad + grupos activos + miembros atendidos + estrellas.
 * Se calcula al vuelo desde datos que ya tenemos (no se guarda nada extra).
 */

export interface Tier {
  key: string;
  label: string;
  color: string;
}

export const TIERS: Array<Tier & { min: number }> = [
  { key: "nuevo", label: "Nuevo", color: "#9ca3af", min: 0 },
  { key: "activo", label: "Activo", color: "#0A84FF", min: 60 },
  { key: "confiable", label: "Confiable", color: "#30D158", min: 180 },
  { key: "verificado", label: "Verificado", color: "#5E5CE6", min: 400 },
  { key: "experto", label: "Experto", color: "#f59e0b", min: 800 },
  { key: "embajador", label: "Embajador", color: "#7c3aed", min: 1600 },
];

export interface LevelInput {
  createdAtMs?: number;
  groupsActive: number;
  membersServed: number;
  ratingSum: number; // suma de estrellas recibidas
}

export function computeScore(i: LevelInput): number {
  const months = i.createdAtMs ? Math.max(0, (Date.now() - i.createdAtMs) / (1000 * 60 * 60 * 24 * 30)) : 0;
  return Math.round(months * 5 + i.groupsActive * 20 + i.membersServed * 3 + i.ratingSum * 2);
}

/** Reglas de puntos, para mostrar en "¿Cómo funciona?". */
export const POINT_RULES = [
  { label: "Por cada mes activo en Poolera", points: "+5" },
  { label: "Por cada grupo activo que tienes", points: "+20" },
  { label: "Por cada miembro que se une a tus grupos", points: "+3" },
  { label: "Por cada estrella recibida en reseñas", points: "+2" },
];

export function tierByKey(key?: string) {
  return TIERS.find((t) => t.key === key) ?? null;
}

/** Índice del tier (0 = más básico). Premium = índice >= 4. */
export function tierIndex(key: string) {
  return TIERS.findIndex((t) => t.key === key);
}

export function levelFor(score: number) {
  let currentIdx = 0;
  for (let k = 0; k < TIERS.length; k++) {
    if (score >= TIERS[k].min) currentIdx = k;
  }
  const current = TIERS[currentIdx];
  const next = TIERS[currentIdx + 1] ?? null;
  const progress = next ? Math.min(1, (score - current.min) / (next.min - current.min)) : 1;
  return { current, next, progress, score };
}
