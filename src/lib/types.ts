import type { ImagePlaceholder } from './placeholder-images';

export type SubscriptionService = 'Netflix' | 'Spotify' | 'ChatGPT' | 'HBO Max' | 'Disney+' | 'YouTube Premium';

export type Country = 'Perú' | 'LatAm';

export type Subscription = {
  id: string;
  service: SubscriptionService;
  price: number;
  totalSlots: number;
  availableSlots: number;
  rating: number;
  country: Country;
  host: string;
  logoId: ImagePlaceholder['id'];
};

export type OrderStatus = 'Pendiente' | 'Activo' | 'En disputa' | 'Finalizado';

export type Order = {
  id: string;
  subscriptionId: string;
  service: SubscriptionService;
  host: string;
  price: number;
  status: OrderStatus;
  expires: string; // date string
  logoId: ImagePlaceholder['id'];
};

export type Group = {
  id: string;
  service: SubscriptionService;
  slots: {
    total: number;
    filled: number;
  };
  publicPrice: number;
  netEarning: number;
  status: 'Activo' | 'Incompleto';
};
