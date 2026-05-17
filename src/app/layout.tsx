import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Poolera",
  description: "Gestión de suscripciones compartidas.",
  icons: {
    icon: '/favicon.svg',
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-background text-foreground pb-24">
        <div className="relative flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 md:px-20 py-6">
            {children}
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
