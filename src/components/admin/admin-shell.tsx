"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Wallet, BadgeCheck, Layers,
  Boxes, BarChart3, ScrollText, Settings, LogOut, Menu, X, ShieldCheck, Send
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
}

const NAV: NavItem[] = [
  { href: "/admin", label: "Resumen", Icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", Icon: Users },
  { href: "/admin/recargas", label: "Recargas pendientes", Icon: Wallet },
  { href: "/admin/retiros", label: "Retiros", Icon: Send },
  { href: "/admin/pagos", label: "Pagos", Icon: BadgeCheck },
  { href: "/admin/suscripciones", label: "Suscripciones", Icon: Layers },
  { href: "/admin/servicios", label: "Servicios", Icon: Boxes },
  { href: "/admin/reportes", label: "Reportes", Icon: BarChart3 },
  { href: "/admin/historial", label: "Historial", Icon: ScrollText },
  { href: "/admin/configuracion", label: "Configuración", Icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Marca */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#5E5CE6] to-primary shadow-lg">
          <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-extrabold tracking-tight text-white">Poolera</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Panel Admin</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors no-underline",
              isActive(href)
                ? "bg-white/10 text-white"
                : "text-white/55 hover:bg-white/[0.06] hover:text-white/90"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Admin actual + logout */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white">
            {(user?.displayName || user?.email || "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[12px] font-bold text-white">{user?.displayName || "Administrador"}</p>
            <p className="truncate text-[10px] text-white/40">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-danger transition-colors hover:bg-danger/10"
        >
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white">
      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-[#11151f] lg:block">
        {SidebarContent}
      </aside>

      {/* Drawer móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-[#11151f]">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Contenido */}
      <div className="lg:pl-64">
        {/* Encabezado del panel */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0b0e14]/80 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-primary">
              <ShieldCheck className="h-3 w-3" /> Modo administrador
            </span>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-[12px] font-bold leading-none">{user?.displayName || "Administrador"}</p>
            <p className="text-[10px] text-white/40">{user?.email}</p>
          </div>
        </header>

        {/* Botón cerrar drawer cuando abierto (accesibilidad) */}
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="fixed right-4 top-3 z-[60] rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
