"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { 
  Mail, 
  Smartphone, 
  Lock, 
  Fingerprint, 
  HelpCircle, 
  LogOut, 
  Edit2,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function PerfilPage() {
  const auth = useAuth();
  const user = auth?.currentUser;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      {/* Profile Identity Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner border-2 border-primary-fixed relative">
            <Image 
              src={user?.photoURL || "https://picsum.photos/seed/user/200/200"} 
              alt={user?.displayName || "User"} 
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-sora font-bold text-on-surface">{user?.displayName || "Usuario de Poolera"}</h1>
            <p className="text-sm font-medium text-on-surface-variant">Miembro desde Enero 2023</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-surface-container text-primary hover:bg-primary hover:text-white transition-all">
            <Edit2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Personal Information */}
        <div className="space-y-2 border-t border-outline-variant/20 pt-6">
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-3 mb-2">Información Personal</h4>
          
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase">Email</span>
              <span className="text-sm font-medium text-on-surface">{user?.email || "Sin email"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase">Teléfono</span>
              <span className="text-sm font-medium text-on-surface">+1 (555) 012-3456</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
        {/* Security & Privacy */}
        <div className="p-6 border-b border-outline-variant/20">
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">Seguridad</h4>
          <nav className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-on-surface">Cambiar Contraseña</span>
              </div>
              <ChevronRight className="h-5 w-5 text-outline-variant" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-on-surface">Login Biométrico</span>
              </div>
              <div className="w-10 h-5 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div>
              </div>
            </button>
          </nav>
        </div>

        {/* Support & Logout */}
        <div className="p-6">
          <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">Ayuda y Soporte</h4>
          <nav className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-on-surface">Centro de Ayuda</span>
              </div>
              <ExternalLink className="h-5 w-5 text-outline-variant" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-colors group text-red-600 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <LogOut className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold">Cerrar Sesión</span>
              </div>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
