"use client";

import { Crown } from "lucide-react";
import { TIERS, tierByKey, tierIndex, levelFor } from "@/lib/levels";

/**
 * Badge de nivel con color que escala: los niveles básicos se ven discretos y
 * los premium (Experto, Embajador) con degradado y brillo.
 */
export function LevelBadge({
  tierKey,
  score,
  size = "sm",
}: {
  tierKey?: string;
  score?: number;
  size?: "xs" | "sm" | "md";
}) {
  const tier = tierKey ? tierByKey(tierKey) : score != null ? levelFor(score).current : null;
  if (!tier) return null;

  const idx = tierIndex(tier.key);
  const premium = idx >= 4; // Experto, Embajador
  const top = idx >= TIERS.length - 1; // Embajador

  const pad = size === "xs" ? "px-1.5 py-0.5 text-[8px]" : size === "md" ? "px-3 py-1 text-[12px]" : "px-2 py-0.5 text-[10px]";
  const icon = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";

  if (premium) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-black uppercase tracking-wide text-white ${pad}`}
        style={{
          background: `linear-gradient(135deg, ${tier.color}, ${TIERS[Math.min(idx + 1, TIERS.length - 1)].color})`,
          boxShadow: top ? `0 0 12px ${tier.color}80` : `0 2px 8px ${tier.color}55`,
        }}
      >
        <Crown className={icon} /> {tier.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-black uppercase tracking-wide ${pad}`}
      style={{ color: tier.color, background: `${tier.color}1A` }}
    >
      <Crown className={icon} /> {tier.label}
    </span>
  );
}
