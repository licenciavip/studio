
export type CategorySlug = 
  | 'streaming' 
  | 'musica' 
  | 'ia' 
  | 'gaming' 
  | 'educacion' 
  | 'diseno' 
  | 'seguridad' 
  | 'deportes' 
  | 'bienestar' 
  | 'software';

export type Subscription = {
  id: string;
  service: string;
  host: string;
  price: number;
  currency: string;
  rating: number;
  availableSlots: number;
  totalSlots: number;
  logoId: string;
  country: string;
  avatarUrl: string;
};
