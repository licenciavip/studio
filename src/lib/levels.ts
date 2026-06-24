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
  { key: "cobre", label: "Cobre", color: "#b87333", min: 0 },
  { key: "bronce", label: "Bronce", color: "#cd7f32", min: 60 },
  { key: "plata", label: "Plata", color: "#9ca3af", min: 180 },
  { key: "oro", label: "Oro", color: "#f59e0b", min: 400 },
  { key: "diamante", label: "Diamante", color: "#38bdf8", min: 800 },
  { key: "lank", label: "Lank", color: "#7c3aed", min: 1600 },
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
