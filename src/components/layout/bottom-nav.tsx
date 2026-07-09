"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2x2, Wallet, User } from "lucide-react";

const navItems = [
  { href: "/inicio",     label: "Inicio",  Icon: Home      },
  { href: "/mis-grupos", label: "Grupos",  Icon: Grid2x2   },
  { href: "/billetera",  label: "Wallet",  Icon: Wallet    },
  { href: "/perfil",     label: "Perfil",  Icon: User      },
];

const HIDDEN_PATHS = ["/", "/login", "/registro"];

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;
  if (HIDDEN_PATHS.includes(pathname)) return null;
  if (pathname.startsWith("/u/")) return null;

  return (
    <nav className="lg-tab-bar">
      {navItems.map(({ href, label, Icon }) => {
        const isActive =
          pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            className={`lg-tab-item${isActive ? " active" : ""}`}
          >
            <Icon strokeWidth={isActive ? 2 : 1.6} />
            <span className="lg-tab-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
