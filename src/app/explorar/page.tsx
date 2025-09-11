import { subscriptions } from "@/lib/data";
import SubscriptionCard from "@/components/subscription-card";

export default function ExplorarPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Explorar Grupos de Suscripción
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Encuentra y únete a grupos para compartir tus suscripciones favoritas al mejor precio.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {subscriptions.map((sub) => (
          <SubscriptionCard key={sub.id} subscription={sub} />
        ))}
      </div>
    </div>
  );
}