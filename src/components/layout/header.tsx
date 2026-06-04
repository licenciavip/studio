"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, Compass, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <header className="lg-header">
      <div className="lg-header-inner">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(145deg, #5E5CE6, #0A84FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(10,132,255,0.35), inset 0 1px 0 rgba(255,255,255,0.30)",
            }}
          >
            <Layers size={14} color="white" strokeWidth={2} />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "rgba(20,20,35,0.85)",
            }}
          >
            Poolera
          </span>
        </Link>

        {/* Acciones */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {!isLoginPage && (
            <Link
              href="/explorar"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                height: 32,
                padding: "0 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                textDecoration: "none",
                transition: "all 0.2s ease",
                background: pathname.startsWith("/explorar")
                  ? "rgba(10,132,255,0.12)"
                  : "transparent",
                color: pathname.startsWith("/explorar")
                  ? "#0A84FF"
                  : "rgba(40,40,55,0.55)",
              }}
            >
              <Compass size={14} strokeWidth={1.8} />
              <span>Explorar</span>
            </Link>
          )}
          <Link
            href={isLoginPage ? "/" : "/perfil"}
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(40,40,55,0.55)",
              transition: "all 0.18s ease",
            }}
          >
            <User size={16} strokeWidth={1.7} />
          </Link>
        </div>
      </div>
    </header>
  );
}
