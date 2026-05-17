
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mail, 
  PhoneIphone, 
  Lock, 
  Fingerprint, 
  HelpOutline, 
  Logout, 
  Edit,
  ChevronRight,
  OpenInNew
} from "@/components/icons"; // Usando un archivo de iconos centralizado o lucide-react equivalente
import { Mail as MailIcon, Phone, Lock as LockIcon, Fingerprint as FingerprintIcon, HelpCircle, LogOut, Edit2, ChevronRight as ChevronRightIcon, ExternalLink } from "lucide-react";

export default function PerfilPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      {/* Profile Identity Card */}
      <Card className="bg-white border-outline-variant/30 rounded-[2.5rem] p-6 shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner relative">
            <Image 
              src="https://picsum.photos/seed/alex/200/200" 
              alt="Alex Thompson" 
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-sora font-bold text-foreground">Alex Thompson</h1>
            <p className="text-xs font-medium text-muted-foreground">Miembro desde Enero 2023</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-surface-container text-primary hover:bg-primary hover:text-white transition-all">
            <Edit2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Personal Information */}
        <div className="space-y-2 border-t border-outline-variant/20 pt-6">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">Información Personal</h4>
          
          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <MailIcon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-foreground">alex.t@example.com</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <Phone className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-foreground">+1 (555) 012-3456</span>
          </div>
        </div>
      </Card>

      {/* Settings Groups */}
      <Card className="bg-white border-outline-variant/30 rounded-[2.5rem] overflow-hidden shadow-sm">
        {/* Security & Privacy */}
        <div className="p-6 border-b border-outline-variant/20">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Seguridad</h4>
          <nav className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <LockIcon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">Cambiar Contraseña</span>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-outline-variant" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <FingerprintIcon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">Login Biométrico</span>
              </div>
              <div className="w-10 h-5 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </button>
          </nav>
        </div>

        {/* Support & Logout */}
        <div className="p-6">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Ayuda y Soporte</h4>
          <nav className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-foreground">Centro de Ayuda</span>
              </div>
              <ExternalLink className="h-5 w-5 text-outline-variant" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors group text-destructive mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <LogOut className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold">Cerrar Sesión</span>
              </div>
            </button>
          </nav>
        </div>
      </Card>
    </div>
  );
}
