
'use client';

import { notFound, useParams } from 'next/navigation';
import { getServiceById, getSubscriptionsByService } from '@/lib/data';
import SubscriptionCard from '@/components/subscription-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function ServiceGroupsPage() {
  const params = useParams();
  const category = params.category as string;
  const serviceId = params.service as string;

  const service = getServiceById(serviceId);
  const subscriptions = getSubscriptionsByService(serviceId);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="pb-24 pt-2 space-y-6">
        {/* Header Compacto Apple Style */}
        <div className="flex items-center gap-3 px-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/40 hover:bg-white/60 active:scale-95 transition-all">
            <Link href={`/explorar/${category}`}>
              <ArrowLeft className="h-4 w-4 text-primary" />
            </Link>
          </Button>
          <div className="space-y-0">
            <h1 className="text-lg font-extrabold tracking-tight text-on-surface">Grupos</h1>
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Servicio: {service.name}</p>
          </div>
        </div>
        
        {subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subscriptions.map(subscription => (
              <SubscriptionCard key={subscription.id} subscription={subscription} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-[2.5rem] border-dashed border-primary/10">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4 text-primary/20">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">No hay grupos disponibles</p>
            <Button asChild variant="link" className="mt-2 text-primary text-[11px] font-bold uppercase tracking-tight">
              <Link href={`/publicar?category=${category}&service=${serviceId}`}>
                ¡Sé el primero en compartir uno!
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
