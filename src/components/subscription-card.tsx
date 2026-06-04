'use client';

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Subscription } from "@/lib/types";
import { Star, Zap, Users } from "lucide-react";

type SubscriptionCardProps = {
  subscription: Subscription;
};

export default function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const availabilityPct = ((subscription.totalSlots - subscription.availableSlots) / subscription.totalSlots) * 100;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.88)",
        borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Host info */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <AvatarImage src={subscription.avatarUrl} alt={subscription.host} />
            <AvatarFallback
              style={{
                background: "rgba(10,132,255,0.08)",
                color: "#0A84FF",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {subscription.host.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(20,20,35,0.85)", letterSpacing: "-0.02em" }}>
              {subscription.host}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 1 }}>
              <Star size={10} style={{ fill: "#FF9F0A", color: "#FF9F0A" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(40,40,55,0.45)" }}>
                {subscription.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Cupos badge */}
        <div
          style={{
            background: "rgba(10,132,255,0.08)",
            border: "1px solid rgba(10,132,255,0.14)",
            borderRadius: 999,
            padding: "3px 10px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Users size={10} color="#0A84FF" />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#0A84FF", letterSpacing: "0.01em" }}>
            {subscription.availableSlots} CUPOS
          </span>
        </div>
      </div>

      {/* Price */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(40,40,55,0.40)" }}>
            {subscription.currency}
          </span>
          <span style={{ fontSize: 28, fontWeight: 800, color: "rgba(20,20,35,0.90)", letterSpacing: "-0.04em", lineHeight: 1 }}>
            {subscription.price.toFixed(2)}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(40,40,55,0.35)", marginLeft: 2 }}>
            /mes
          </span>
        </div>

        {/* Slot bar */}
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 3, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${availabilityPct}%`,
                background: availabilityPct > 70 ? "#FF453A" : availabilityPct > 40 ? "#FF9F0A" : "#30D158",
                borderRadius: 999,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <p style={{ fontSize: 10, color: "rgba(40,40,55,0.35)", marginTop: 4, fontWeight: 500 }}>
            Validación BCP incluida
          </p>
        </div>
      </div>

      {/* CTA */}
      <Link href={`/checkout/${subscription.id}`} style={{ textDecoration: "none" }}>
        <div
          style={{
            width: "100%",
            height: 42,
            background: "#0A84FF",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(10,132,255,0.35), inset 0 1px 0 rgba(255,255,255,0.20)",
            transition: "all 0.18s ease",
          }}
        >
          <Zap size={13} color="white" strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
            Unirme
          </span>
        </div>
      </Link>
    </div>
  );
}
