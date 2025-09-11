import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Subscription } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star, Users, Globe, CheckCircle } from "lucide-react";

type SubscriptionCardProps = {
  subscription: Subscription;
};

export default function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const logo = PlaceHolderImages.find((img) => img.id === subscription.logoId);
  const slotsAvailable = subscription.availableSlots > 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex-row items-start gap-4 p-4">
        {logo && (
          <Image
            src={logo.imageUrl}
            alt={logo.description}
            width={64}
            height={64}
            className="rounded-lg border"
            data-ai-hint={logo.imageHint}
          />
        )}
        <div className="flex-1">
          <CardTitle className="text-xl font-headline">{subscription.service}</CardTitle>
          <CardDescription>
            por <span className="font-semibold text-primary">{subscription.host}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0 space-y-3">
        <div className="text-3xl font-bold">
          ${subscription.price.toFixed(2)}
          <span className="text-sm font-normal text-muted-foreground">/mes</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>
              {subscription.availableSlots} de {subscription.totalSlots} cupos
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{subscription.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1.5">
             <Globe className="h-4 w-4" />
             <span>{subscription.country}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50">
        {slotsAvailable ? (
          <Button asChild className="w-full bg-accent hover:bg-accent/90">
            <Link href={`/checkout/${subscription.id}`}>Unirse al grupo</Link>
          </Button>
        ) : (
          <Button disabled className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Completo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
