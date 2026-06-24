"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore, useUser } from "@/firebase";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { reserveSlug } from "@/lib/slug";

/**
 * Decide el destino tras autenticarse leyendo la custom claim `admin` del token.
 * Se fuerza el refresco del token para tomar claims recién asignadas.
 */
async function resolveDestination(user: User): Promise<"/admin" | "/inicio"> {
  try {
    const tokenResult = await user.getIdTokenResult(true);
    return tokenResult.claims.admin === true ? "/admin" : "/inicio";
  } catch {
    return "/inicio";
  }
}

const authErrorMessages: Record<string, string> = {
  "auth/invalid-email": "El correo no es válido.",
  "auth/user-not-found": "No existe una cuenta con ese correo.",
  "auth/wrong-password": "Contraseña incorrecta.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
};

function mapAuthError(e: unknown): string {
  if (e instanceof FirebaseError && authErrorMessages[e.code]) {
    return authErrorMessages[e.code];
  }
  return "Ocurrió un error. Inténtalo de nuevo.";
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading, isAdmin } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "registro">("login");

  // Registro fields
  const [nombre, setNombre] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Si ya hay sesión activa al abrir /login, redirige según el rol.
  useEffect(() => {
    if (loading || !user) return;
    router.replace(isAdmin ? "/admin" : "/inicio");
  }, [loading, user, isAdmin, router]);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const dest = await resolveDestination(cred.user);
      toast({ title: "¡Bienvenido!", description: "Sesión iniciada correctamente." });
      router.replace(dest);
    } catch (e) {
      toast({ title: "Error", description: mapAuthError(e), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistro = async () => {
    if (!nombre || !email || !password || !confirmPass) return;
    if (password !== confirmPass) {
      toast({ title: "Error", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: nombre.trim() });
      // Crear documento del usuario en Firestore (necesario para roles, billetera, etc.)
      await setDoc(doc(firestore, "users", cred.user.uid), {
        uid: cred.user.uid,
        displayName: nombre.trim(),
        email: email.trim(),
        role: "user",
        createdAt: serverTimestamp(),
      });
      // Perfil público (solo datos seguros) para el sistema de reputación.
      const slug = await reserveSlug(firestore, cred.user.uid, nombre.trim());
      await setDoc(doc(firestore, "publicProfiles", cred.user.uid), {
        uid: cred.user.uid,
        displayName: nombre.trim(),
        slug,
        avatarSeed: "",
        ratingSum: 0,
        ratingCount: 0,
        createdAt: serverTimestamp(),
      });
      toast({ title: "¡Cuenta creada!", description: "Bienvenido a Poolera." });
      // Una cuenta recién creada nunca es admin → entorno de usuario.
      router.replace("/inicio");
    } catch (e) {
      toast({ title: "Error", description: mapAuthError(e), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-on-surface">Poolera Digital</h1>
            <p className="text-[9px] font-bold text-on-surface/30 uppercase tracking-widest">Suscripciones de IA compartidas</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-1 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex">
          <button
            onClick={() => setTab("login")}
            className={cn(
              "flex-1 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all",
              tab === "login" ? "bg-white text-primary shadow-sm" : "text-on-surface/40"
            )}
          >
            Entrar
          </button>
          <button
            onClick={() => setTab("registro")}
            className={cn(
              "flex-1 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all",
              tab === "registro" ? "bg-white text-primary shadow-sm" : "text-on-surface/40"
            )}
          >
            Registrarse
          </button>
        </div>

        {/* Login Form */}
        {tab === "login" && (
          <div className="glass-card p-6 rounded-[2rem] space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full h-11 text-sm font-bold px-4"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Contraseña</label>
                <button className="text-[9px] font-bold text-primary/60 uppercase tracking-widest">¿Olvidaste?</button>
              </div>
              <div className="flex gap-2">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="glass-input flex-1 h-11 text-sm font-bold px-4"
                />
                <button onClick={() => setShowPass(!showPass)} className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  {showPass ? <EyeOff className="h-4 w-4 text-on-surface/40" /> : <Eye className="h-4 w-4 text-on-surface/40" />}
                </button>
              </div>
            </div>
            <Button
              className="w-full h-11 rounded-2xl font-bold mt-2"
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
        )}

        {/* Registro Form */}
        {tab === "registro" && (
          <div className="glass-card p-6 rounded-[2rem] space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Nombre completo</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="glass-input w-full h-11 text-sm font-bold px-4"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full h-11 text-sm font-bold px-4"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Contraseña</label>
              <div className="flex gap-2">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input flex-1 h-11 text-sm font-bold px-4"
                />
                <button onClick={() => setShowPass(!showPass)} className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                  {showPass ? <EyeOff className="h-4 w-4 text-on-surface/40" /> : <Eye className="h-4 w-4 text-on-surface/40" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-on-surface/40">Confirmar contraseña</label>
              <input
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegistro()}
                className="glass-input w-full h-11 text-sm font-bold px-4"
              />
            </div>
            <Button
              className="w-full h-11 rounded-2xl font-bold mt-2"
              onClick={handleRegistro}
              disabled={isLoading || !nombre || !email || !password || !confirmPass}
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </div>
        )}

        <p className="text-center text-[9px] text-on-surface/20">
          Al continuar aceptas los{" "}
          <span className="text-primary/50 font-bold">Términos de uso</span>
        </p>
      </div>
    </div>
  );
}
