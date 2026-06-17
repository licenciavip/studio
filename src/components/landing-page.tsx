"use client";

import Link from "next/link";
import {
  Layers, ArrowRight, Check, Star, TrendingDown,
  TrendingUp, Zap, Shield, ChevronDown,
} from "lucide-react";
import { useState } from "react";

const SERVICES = [
  { name: "ChatGPT Plus", price: "26.90", discount: "-58%", color: "#10a37f", tag: "MÁS POPULAR" },
  { name: "Claude Pro",   price: "47.90", discount: "-32%", color: "#d97757", tag: "" },
  { name: "Gemini AI",    price: "16.90", discount: "-65%", color: "#4285f4", tag: "MEJOR PRECIO" },
  { name: "Perplexity",  price: "47.90", discount: "-46%", color: "#0b1416", tag: "" },
];

const STEPS = [
  {
    n: "01",
    title: "Elige tu IA favorita",
    desc: "Explora ChatGPT, Claude, Gemini y Perplexity. Filtra por precio y disponibilidad.",
  },
  {
    n: "02",
    title: "Únete a un grupo",
    desc: "Selecciona el grupo que más te conviene y reserva tu cupo en segundos.",
  },
  {
    n: "03",
    title: "Accede al instante",
    desc: "Paga tu parte, recibe las credenciales y empieza a usar tu IA premium hoy.",
  },
];

const BUYER_FEATURES = [
  "Ahorra hasta 70% en IA premium",
  "Acceso inmediato tras validar el pago",
  "Sin contratos ni compromisos",
  "Sistema de disputas con reembolso",
];

const HOST_FEATURES = [
  "Gana el 85% de cada pago recibido",
  "Comparte tus suscripciones actuales",
  "Cobra cada mes de forma automática",
  "Hasta S/200 extra al mes sin esfuerzo",
];

const FAQS = [
  {
    q: "¿Es seguro compartir una suscripción de IA?",
    a: "Sí. Plataformas como ChatGPT y Gemini permiten el uso compartido en el mismo plan. Cada miembro tiene su propio historial y privacidad.",
  },
  {
    q: "¿Cuánto puedo ahorrar al mes?",
    a: "Depende del servicio. ChatGPT Plus individual cuesta S/65/mes. En Poolera desde S/26.90, ahorrando más de S/38 cada mes.",
  },
  {
    q: "¿Cómo funciona el pago?",
    a: "Transferencia bancaria al BCP. Subes tu comprobante y en menos de 2 horas validamos tu pago y activamos el acceso.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Sí. No hay contratos ni penalidades. Cuando vence tu período, simplemente no renuevas. Sin letra chica.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="glass-card rounded-2xl px-4 py-3.5 text-left w-full cursor-pointer block"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold text-on-surface leading-snug">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-on-surface/30 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="text-xs font-medium text-on-surface/55 leading-relaxed mt-2.5 pr-2">{a}</p>
      )}
    </button>
  );
}

export function LandingPage() {
  return (
    <div
      className="fixed inset-0 z-[2000] overflow-y-auto"
      style={{
        background: `
          radial-gradient(ellipse at 60% -10%, rgba(100,100,255,0.10) 0%, transparent 60%),
          radial-gradient(ellipse at -10% 80%, rgba(120,180,255,0.07) 0%, transparent 50%),
          #f5f5fa
        `,
      }}
    >
      <div className="min-h-full">

        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 backdrop-blur-2xl bg-white/30 border-b border-white/40">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#5E5CE6] to-primary shadow-md">
              <Layers className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-extrabold tracking-tighter text-on-surface">Poolera</span>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/login"
              className="text-xs font-bold text-on-surface/55 no-underline px-3 py-2 rounded-full hover:text-on-surface/80 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/login"
              className="glass-button text-xs font-bold text-primary no-underline px-4 py-2 rounded-full"
            >
              Registro
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="px-5 pt-12 pb-10 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-[10px] font-black uppercase tracking-widest text-primary mb-5">
            <Zap className="h-3 w-3" />
            IA Compartida · Ahorra desde hoy
          </div>

          <h1 className="text-[2.6rem] font-extrabold tracking-tighter leading-[1.05] text-on-surface mb-4">
            IA premium.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E5CE6] to-primary">
              Sin pagar de más.
            </span>
          </h1>

          <p className="text-sm font-medium leading-relaxed text-on-surface/55 mb-7 max-w-[260px] mx-auto">
            Accede a ChatGPT, Claude y Gemini compartiendo el costo con otros.{" "}
            <strong className="text-on-surface/80">Ahorra hasta 70%</strong> al mes, sin contratos.
          </p>

          <div className="flex flex-col gap-2.5 max-w-[280px] mx-auto mb-5">
            <Link href="/login" className="no-underline">
              <div className="h-12 flex items-center justify-center gap-2 rounded-2xl bg-primary text-white font-bold text-sm shadow-[0_4px_18px_rgba(10,132,255,0.40),inset_0_1px_0_rgba(255,255,255,0.20)] transition-transform active:scale-[0.98]">
                Crear cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
            <Link href="/explorar" className="no-underline">
              <div className="h-11 flex items-center justify-center gap-2 rounded-2xl glass-card text-on-surface/60 font-semibold text-sm transition-transform active:scale-[0.98]">
                <TrendingDown className="h-3.5 w-3.5 text-primary" />
                Ver cupos disponibles
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-on-surface/35 uppercase tracking-wider">
            <Shield className="h-3 w-3" />
            Seguro · Sin contrato · Cancela cuando quieras
          </div>
        </section>

        {/* ── Service cards (horizontal scroll) ── */}
        <section className="pb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.08em] text-on-surface/35 mb-3 text-center px-5">
            Disponibles ahora
          </p>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
            {SERVICES.map((s) => (
              <div
                key={s.name}
                className="flex-shrink-0 glass-card rounded-2xl p-4 w-[148px] relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-[0.07]"
                  style={{ background: s.color }}
                />
                <div className="relative z-10">
                  {s.tag && (
                    <div className="inline-flex px-2 py-0.5 rounded-full text-[8px] font-black bg-primary/10 text-primary mb-2 tracking-wide">
                      {s.tag}
                    </div>
                  )}
                  {!s.tag && <div className="h-[18px] mb-2" />}
                  <p className="text-[11px] font-extrabold text-on-surface mb-1">{s.name}</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                      {s.discount}
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface/40 font-medium">Desde</p>
                  <p className="text-xl font-extrabold text-on-surface tracking-tight leading-none">
                    S/{s.price}
                  </p>
                  <p className="text-[9px] text-on-surface/30 font-medium mt-0.5">al mes</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="px-5 pb-12">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Ahorro promedio", value: "70%",  Icon: TrendingDown },
              { label: "Usuarios activos", value: "500+", Icon: Star         },
              { label: "IAs disponibles",  value: "4",   Icon: Zap          },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="glass-card rounded-2xl p-3.5 text-center">
                <Icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                <p className="text-[1.4rem] font-extrabold text-on-surface tracking-tighter leading-none mb-1">
                  {value}
                </p>
                <p className="text-[9px] font-semibold text-on-surface/40 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cómo funciona ── */}
        <section className="px-5 pb-12">
          <div className="text-center mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-on-surface/35 mb-1">
              Simple
            </p>
            <h2 className="text-2xl font-extrabold tracking-tighter text-on-surface">
              ¿Cómo funciona?
            </h2>
          </div>
          <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
            {STEPS.map((step) => (
              <div key={step.n} className="glass-card rounded-2xl p-4 flex items-start gap-3.5">
                <span className="text-[11px] font-black text-primary/40 tracking-tight mt-0.5 flex-shrink-0 w-6">
                  {step.n}
                </span>
                <div>
                  <p className="text-sm font-extrabold text-on-surface">{step.title}</p>
                  <p className="text-xs font-medium text-on-surface/45 leading-relaxed mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Para compradores / anfitriones ── */}
        <section className="px-5 pb-12">
          <div className="text-center mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-on-surface/35 mb-1">
              Dos formas
            </p>
            <h2 className="text-2xl font-extrabold tracking-tighter text-on-surface">
              Úsalo como quieras
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {/* Compradores */}
            <div className="rounded-3xl p-5 bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] border border-primary/[0.10]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <TrendingDown className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight text-on-surface">Para compradores</p>
                  <p className="text-[10px] text-on-surface/40 font-medium">Ahorra en IA premium</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {BUYER_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs font-semibold text-on-surface/65">
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Anfitriones */}
            <div className="rounded-3xl p-5 bg-gradient-to-br from-[#30D158]/[0.08] to-[#30D158]/[0.02] border border-[#30D158]/[0.10]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#30D158]/10 flex-shrink-0">
                  <TrendingUp className="h-4.5 w-4.5 text-[#30D158]" />
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight text-on-surface">Para anfitriones</p>
                  <p className="text-[10px] text-on-surface/40 font-medium">Gana dinero compartiendo</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {HOST_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-xs font-semibold text-on-surface/65">
                    <Check className="h-3.5 w-3.5 text-[#30D158] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-5 pb-12">
          <div className="text-center mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-on-surface/35 mb-1">
              FAQ
            </p>
            <h2 className="text-2xl font-extrabold tracking-tighter text-on-surface">
              Preguntas frecuentes
            </h2>
          </div>
          <div className="flex flex-col gap-2 max-w-sm mx-auto">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-5 pb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5E5CE6] to-primary p-7 text-center shadow-[0_8px_32px_rgba(10,132,255,0.28),inset_0_1px_0_rgba(255,255,255,0.20)]">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10)_0%,transparent_70%)]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 relative z-10">
              Empieza hoy
            </p>
            <h2 className="text-2xl font-extrabold tracking-tighter text-white mb-1.5 relative z-10">
              Tu IA premium,
              <br />
              al precio justo.
            </h2>
            <p className="text-xs text-white/60 mb-6 font-medium relative z-10">
              Únete gratis. Sin tarjeta. Sin sorpresas.
            </p>
            <Link href="/login" className="no-underline relative z-10 block">
              <div className="h-12 flex items-center justify-center gap-2 rounded-2xl bg-white text-primary font-black text-sm shadow-md transition-transform active:scale-[0.97] mx-auto max-w-[220px]">
                Crear cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-5 pb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#5E5CE6] to-primary">
              <Layers className="h-3 w-3 text-white" strokeWidth={2} />
            </div>
            <span className="text-xs font-bold tracking-tight text-on-surface/40">Poolera Digital</span>
          </div>
          <p className="text-[10px] text-on-surface/25 font-medium">
            © 2025 Poolera Digital ·{" "}
            <span className="text-primary/40 cursor-pointer">Términos</span> ·{" "}
            <span className="text-primary/40 cursor-pointer">Privacidad</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
