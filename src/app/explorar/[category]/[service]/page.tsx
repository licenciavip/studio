
'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { getServiceById, getSubscriptionsByService } from '@/lib/data';
import SubscriptionCard from '@/components/subscription-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ServiceGroupsPage() {
  const params = useParams();
  const router = useRouter();

  const category = params.category as string;
  const serviceId = params.service as string;

  const service = getServiceById(serviceId);
  const subscriptions = getSubscriptionsByService(serviceId);

  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1">
          <Button asChild variant="outline">
            <Link href={`/explorar/${category}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regresar
            </Link>
          </Button>
        </div>
        <div className="flex-[2] text-center">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Grupos disponibles
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Servicio: {service.name}
          </p>
        </div>
        <div className="flex-1"></div>
      </div>
      
      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subscriptions.map(subscription => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <p className="text-muted-foreground">No hay grupos disponibles para este servicio en este momento.</p>
        </div>
      )}
    </div>
  );
}
