"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { servicesByCategory, groups } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight, Plus, Sparkles, Zap,
  TrendingDown, TrendingUp, Search
} from "lucide-react";
import type { CategorySlug, Service } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  ia: "IA & Herramientas",
};

const NOVEDADES = [
  {
    id: 1,
    title: "IA Pro Ilimitada",
    desc: "Claude 3.5 Sonnet disponible",
    icon: Sparkles,
    accent: "#5E5CE6",
  },
  {
    id: 2,
    title: "Pagos Rápidos",
    desc: "Validación BCP < 30 min",
    icon: Zap,
    accent: "#FF9F0A",
  },
];

const MOCK_USER = { displayName: "Deyvid" };

export default function Home() {
  const [recommendation, setRecommendation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const user = MOCK_USER;

  const groupedServices = useMemo(() =>
    Object.fromEntries(
      Object.entries(servicesByCategory).filter(([_, s]) => s.length > 0)
    ) as Record<CategorySlug, Service[]>,
  []);

  const handleRecommend = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && recommendation.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        toast({ title: "¡Gracias!", description: "Sugerencia recibida." });
        setRecommendation("");
        setIsSubmitting(false);
      }, 600);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Hero card — propuesta de valor ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #5E5CE6 0%, #0A84FF 100%)",
          borderRadius: 24,
          padding: "20px 20px 18px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(10,132,255,0.28), inset 0 1px 0 rgba(255,255,255,0.20)",
        }}
      >
        {/* Glare */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160,
          background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          Poolera Digital
        </p>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 6 }}>
          Accede a IA premium<br />pagando solo tu parte
        </h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", fontWeight: 500, lineHeight: 1.5, marginBottom: 16 }}>
          Comparte o compra cupos de ChatGPT, Claude, Gemini y más. Hasta <strong style={{ color: "white" }}>70% más barato</strong>.
        </p>

        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/explorar" style={{ flex: 1, textDecoration: "none" }}>
            <div style={{
              height: 36, borderRadius: 999,
              background: "rgba(255,255,255,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              fontSize: 12, fontWeight: 700, color: "#0A84FF",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}>
              <TrendingDown size={13} /> Explorar cupos
            </div>
          </Link>
          <Link href="/login" style={{ flex: 1, textDecoration: "none" }}>
            <div style={{
              height: 36, borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.90)",
            }}>
              <TrendingUp size={13} /> Compartir
            </div>
          </Link>
        </div>
      </section>

      {/* ── Saludo + acción principal ── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "rgba(20,20,35,0.90)", letterSpacing: "-0.03em" }}>
            Hola, {user?.displayName?.split(" ")[0] || "Deyvid"} 👋
          </h2>
        </div>
        <Link href="/compartir" style={{ textDecoration: "none" }}>
          <div style={{
            height: 44, borderRadius: 14,
            background: "#0A84FF",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            boxShadow: "0 4px 18px rgba(10,132,255,0.35), inset 0 1px 0 rgba(255,255,255,0.20)",
          }}>
            <Plus size={15} color="white" strokeWidth={2.5} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
              Compartir suscripción
            </span>
          </div>
        </Link>
      </section>

      {/* ── Grupos activos ── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(40,40,55,0.40)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Activos
          </span>
          <Link href="/mis-grupos" style={{ fontSize: 11, fontWeight: 700, color: "#0A84FF", textDecoration: "none" }}>
            Ver todo
          </Link>
        </div>

        {groups.slice(0, 1).map((group) => (
          <Link key={group.id} href={`/mis-grupos/${group.id}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 16,
              padding: "12px 14px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(10,132,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Sparkles size={16} color="#0A84FF" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(20,20,35,0.85)", letterSpacing: "-0.01em" }}>
                    {group.service}
                  </p>
                  <p style={{ fontSize: 10, color: "rgba(40,40,55,0.40)", fontWeight: 500, marginTop: 1 }}>
                    {group.slots.filled}/{group.slots.total} cupos
                  </p>
                </div>
              </div>
              <ChevronRight size={14} color="rgba(40,40,55,0.25)" />
            </div>
          </Link>
        ))}
      </section>

      {/* ── Novedades ── */}
      <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(40,40,55,0.40)", letterSpacing: "0.04em", textTransform: "uppercase", padding: "0 2px" }}>
          Novedades
        </span>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }} className="no-scrollbar">
          {NOVEDADES.map(({ id, title, desc, icon: Icon, accent }) => (
            <div key={id} style={{
              minWidth: 150,
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 16,
              padding: "14px",
              display: "flex", flexDirection: "column", gap: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: `${accent}14`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={15} color={accent} />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(20,20,35,0.85)", letterSpacing: "-0.01em" }}>{title}</p>
                <p style={{ fontSize: 10, color: "rgba(40,40,55,0.45)", marginTop: 2, lineHeight: 1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Grid de servicios ── */}
      {Object.entries(groupedServices).map(([slug, services]) => (
        <section key={slug} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(40,40,55,0.40)", letterSpacing: "0.04em", textTransform: "uppercase", padding: "0 2px" }}>
            {categoryLabels[slug] || slug}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {services.map((service) => {
              const isLight = service.color?.toLowerCase() === "#ffffff";
              const bg = isLight ? "rgba(255,255,255,0.88)" : (service.color || "#4343d5");
              const textColor = isLight ? "rgba(20,20,35,0.85)" : "rgba(255,255,255,0.95)";
              const subColor = isLight ? "rgba(40,40,55,0.40)" : "rgba(255,255,255,0.55)";
              return (
                <Link key={service.id} href={`/explorar/all/${service.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: bg,
                    borderRadius: 16,
                    aspectRatio: "1/1",
                    padding: "10px",
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    border: isLight ? "1px solid rgba(0,0,0,0.06)" : "none",
                    boxShadow: isLight
                      ? "0 1px 4px rgba(0,0,0,0.04)"
                      : `0 4px 16px ${bg}44`,
                    position: "relative", overflow: "hidden",
                  }}>
                    {!isLight && (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
                        pointerEvents: "none",
                      }} />
                    )}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p style={{ fontSize: 9, fontWeight: 800, color: textColor, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                        {service.name}
                      </p>
                      <p style={{ fontSize: 7, fontWeight: 600, color: subColor, textTransform: "uppercase", letterSpacing: "0.03em", marginTop: 1 }}>
                        {service.planName || "PRO"}
                      </p>
                    </div>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p style={{ fontSize: 7, fontWeight: 700, color: subColor, textTransform: "uppercase", letterSpacing: "0.03em" }}>DESDE</p>
                      <p style={{ fontSize: 12, fontWeight: 800, color: textColor, letterSpacing: "-0.02em" }}>
                        S/{service.pricePerMonth}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      {/* ── Sugerencias ── */}
      <section style={{
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 20,
        padding: "18px",
        textAlign: "center",
        marginBottom: 8,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(40,40,55,0.35)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4 }}>
          Propón una IA
        </p>
        <p style={{ fontSize: 12, color: "rgba(40,40,55,0.50)", marginBottom: 12 }}>
          ¿No encuentras lo que buscas?
        </p>
        <div style={{ maxWidth: 180, margin: "0 auto", position: "relative" }}>
          <Search size={13} color="rgba(40,40,55,0.30)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="glass-input"
            style={{ width: "100%", paddingLeft: 32, fontSize: 12, height: 36, textAlign: "left" }}
            placeholder="Ej: Midjourney..."
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            onKeyDown={handleRecommend}
            disabled={isSubmitting}
          />
        </div>
      </section>
    </div>
  );
}
