"use client";

import Link from "next/link";
import { servicesByCategory } from "@/lib/data";
import {
  Layers, Sparkles, ShieldCheck, Wallet, Users,
  ArrowRight, Check, TrendingDown
} from "lucide-react";

const PASOS = [
  {
    icon: Users,
    title: "Únete a un grupo",
    desc: "Elige el servicio de IA que quieres y entra a un cupo disponible.",
  },
  {
    icon: Wallet,
    title: "Paga solo tu parte",
    desc: "Transferencia simple por Yape o banco. Validamos tu pago rápido.",
  },
  {
    icon: Sparkles,
    title: "Disfruta premium",
    desc: "Accede a ChatGPT, Claude o Gemini Pro a una fracción del precio.",
  },
];

export default function LandingPage() {
  const servicios = servicesByCategory.ia ?? [];

  return (
    <div className="mx-auto w-full max-w-[var(--content-max-width)] px-4 sm:px-6 pb-16">

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between pt-[calc(1rem+env(safe-area-inset-top))] pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#5E5CE6] to-primary shadow-[0_2px_8px_rgba(10,132,255,0.35),inset_0_1px_0_rgba(255,255,255,0.30)]">
            <Layers className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <span className="text-base font-extrabold tracking-tighter text-on-surface">Poolera</span>
        </div>
        <Link
          href="/login"
          className="flex h-9 items-center rounded-full px-4 text-xs font-bold text-primary no-underline transition-colors hover:bg-primary/10"
        >
          Iniciar sesión
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="relative mt-2 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#5E5CE6] to-primary p-7 sm:p-9 shadow-[0_12px_40px_rgba(10,132,255,0.30),inset_0_1px_0_rgba(255,255,255,0.20)]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-white/90 backdrop-blur">
            <TrendingDown className="h-3 w-3" /> Hasta 70% más barato
          </span>
          <h1 className="mt-4 text-[28px] sm:text-4xl font-extrabold leading-[1.1] tracking-tighter text-white">
            Accede a IA premium pagando solo tu parte
          </h1>
          <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-white/75">
            Comparte cupos de ChatGPT, Claude, Gemini y más con otras personas. De forma simple, segura y al mejor precio.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link href="/login" className="flex-1 no-underline">
              <div className="flex h-12 items-center justify-center gap-2 rounded-full bg-white text-sm font-bold text-primary shadow-lg transition-transform active:scale-95">
                Crear cuenta gratis <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
            <Link href="/login" className="flex-1 no-underline">
              <div className="flex h-12 items-center justify-center rounded-full border border-white/35 bg-white/[0.12] text-sm font-bold text-white transition-transform active:scale-95">
                Ya tengo cuenta
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Servicios disponibles con precio ── */}
      <section className="mt-10">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tighter text-on-surface">
          Únete desde S/16.90 al mes
        </h2>
        <p className="mt-1 text-sm text-on-surface/50">
          Estos son algunos de los servicios que puedes compartir hoy.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
          {servicios.map((service) => {
            const bg = service.color || "#4343d5";
            return (
              <Link key={service.id} href="/login" className="no-underline">
                <div
                  className="relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 transition-transform active:scale-95 shadow-lg shadow-black/10"
                  style={{ background: bg, minHeight: 130 }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.14] to-transparent" />
                  <div className="relative z-10">
                    <p className="text-sm font-extrabold leading-tight tracking-tight text-white">
                      {service.name}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.03em] text-white/60">
                      {service.planName || "PRO"}
                    </p>
                  </div>
                  <div className="relative z-10">
                    {service.discount && (
                      <span className="inline-block rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] font-black text-white">
                        {service.discount}
                      </span>
                    )}
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.03em] text-white/60">Únete desde</p>
                    <p className="text-lg font-extrabold tracking-tighter text-white">
                      S/{service.pricePerMonth}
                      <span className="text-[10px] font-semibold text-white/60"> /mes</span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="mt-12">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tighter text-on-surface">
          ¿Cómo funciona?
        </h2>
        <div className="mt-5 flex flex-col gap-3">
          {PASOS.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="glass-card flex items-start gap-4 rounded-2xl p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-primary/50">0{i + 1}</span>
                  <p className="text-sm font-bold tracking-tight text-on-surface">{title}</p>
                </div>
                <p className="mt-0.5 text-[13px] leading-snug text-on-surface/55">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Confianza ── */}
      <section className="mt-12">
        <div className="glass-card rounded-[1.8rem] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-extrabold tracking-tight text-on-surface">
            Pagos protegidos
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-on-surface/55">
            Tu dinero queda retenido hasta confirmar que el servicio funciona. Si algo falla, abres una disputa y te devolvemos tu parte.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {["Validación de pagos rápida", "Saldo en billetera propia", "Soporte y disputas"].map((t) => (
              <li key={t} className="flex items-center gap-2 text-[13px] font-medium text-on-surface/70">
                <Check className="h-4 w-4 text-success" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="mt-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#5E5CE6] to-primary p-8 text-center shadow-[0_12px_40px_rgba(10,132,255,0.30)]">
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold tracking-tighter text-white">
              Empieza a ahorrar hoy
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Crea tu cuenta gratis y únete a tu primer grupo en minutos.
            </p>
            <Link href="/login" className="mt-5 inline-block no-underline">
              <div className="flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-primary shadow-lg transition-transform active:scale-95">
                Crear cuenta gratis <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-12 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-1.5 opacity-50">
          <Layers className="h-3.5 w-3.5 text-on-surface" />
          <span className="text-xs font-bold tracking-tight text-on-surface">Poolera</span>
        </div>
        <p className="text-[11px] text-on-surface/40">
          Suscripciones compartidas · Hecho en Perú 🇵🇪
        </p>
      </footer>
    </div>
  );
}
