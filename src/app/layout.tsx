
import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";
import { AuthGuard } from "@/components/auth-guard";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poolera",
  description: "Gestión de suscripciones compartidas. Fintech Colaborativa.",
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0&display=block" />
      </head>
      <body className={cn("min-h-screen bg-background text-foreground font-sans antialiased", sora.variable)} suppressHydrationWarning>
        <FirebaseClientProvider>
          <FirebaseErrorListener />
          <div className="relative flex flex-col min-h-screen">
            <div className="lg-scroll-edge" aria-hidden />
            <Header />
            <main className="flex-1 w-full mx-auto max-w-[var(--content-max-width)] px-4 sm:px-6 pb-28 pt-[calc(5rem+env(safe-area-inset-top))]">
              <AuthGuard>{children}</AuthGuard>
            </main>
            <BottomNav />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
