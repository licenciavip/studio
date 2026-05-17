import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Balance Summary Section */}
      <section>
        <div className="relative overflow-hidden rounded-3xl bg-primary-container p-6 text-primary-foreground shadow-lg shadow-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Saldo Disponible</p>
              <h1 className="text-5xl font-headline font-bold tracking-tight">$142.50</h1>
            </div>
            <Link 
              href="/billetera" 
              className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 self-start md:self-center"
            >
              Ir a Billetera
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-2 gap-4">
        <Link 
          href="/explorar" 
          className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-outline-variant/30 shadow-sm hover:bg-surface-container transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary">group_add</span>
          </div>
          <span className="text-sm font-bold text-foreground">Unirse a un grupo</span>
        </Link>
        <Link 
          href="/compartir" 
          className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-outline-variant/30 shadow-sm hover:bg-surface-container transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-secondary">ios_share</span>
          </div>
          <span className="text-sm font-bold text-foreground">Compartir suscripción</span>
        </Link>
      </section>

      {/* Your Groups Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-headline font-bold text-foreground">Tus Grupos</h2>
          <Link href="/mis-grupos" className="text-primary text-sm font-bold hover:underline">Ver todos</Link>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-outline-variant/50 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center border border-outline-variant/30 overflow-hidden">
                <Image src="https://picsum.photos/seed/netflix/100/100" alt="netflix" width={40} height={40} />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Netflix Premium</h3>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-4/5"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">4/5 slots</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-foreground">$4.50</span>
              <span className="text-xs font-bold text-secondary">Activo</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-outline-variant/50 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center border border-outline-variant/30 overflow-hidden">
                <Image src="https://picsum.photos/seed/spotify/100/100" alt="spotify" width={40} height={40} />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Spotify Family</h3>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-full"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">6/6 slots</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-foreground">$3.20</span>
              <span className="text-xs font-bold text-secondary">Activo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Novedades Section */}
      <section>
        <h2 className="text-xl font-headline font-bold text-foreground mb-4">Novedades</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
          <div className="min-w-[280px] snap-start glass-card rounded-3xl overflow-hidden relative group">
            <div className="h-32 bg-surface-container-highest relative">
              <Image src="https://picsum.photos/seed/promo1/400/200" alt="adobe" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            </div>
            <div className="p-4 relative">
              <span className="inline-block bg-primary text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold mb-2">Nuevo</span>
              <h4 className="font-bold text-foreground mb-1">Adobe Creative Cloud</h4>
              <p className="text-xs text-muted-foreground">Únete a un equipo y ahorra un 60%.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual FAB */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}
