import SubscriptionCard from "@/components/subscription-card";
import { subscriptions } from "@/lib/data";

const STREAMING_SERVICES: string[] = ["Netflix", "Disney+", "HBO Max", "YouTube Premium"];

export default function StreamingServicesPage() {
  const streamingSubscriptions = subscriptions.filter((sub) =>
    STREAMING_SERVICES.includes(sub.service)
  );

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Películas y Series
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-foreground/80 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Grupos disponibles para unirte. ¡Ahorra en tus servicios favoritos!
        </p>
      </div>

      {streamingSubscriptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streamingSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              showAction="join"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            Actualmente no hay grupos disponibles en esta categoría.
          </p>
        </div>
      )}
    </div>
  );
}