
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Subscription } from "@/lib/types";
import { Star } from "lucide-react";

type SubscriptionCardProps = {
  subscription: Subscription;
};

export default function SubscriptionCard({ subscription }: SubscriptionCardProps) {

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex-row items-center gap-4 p-4">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={subscription.avatarUrl} alt={`Avatar de ${subscription.host}`} />
          <AvatarFallback>{subscription.host.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">Grupo de {subscription.host}</CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{subscription.rating.toFixed(1)} / 5</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-4 pt-0">
          <div className="text-2xl font-bold">
            {subscription.currency} {subscription.price.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground"> / mes</span>
          </div>
      </CardContent>

      <CardFooter className="p-4 bg-muted/50">
        <Button asChild className="w-full">
          <Link href={`/checkout/${subscription.id}`}>Unirme</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
