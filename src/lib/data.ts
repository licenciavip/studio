
// Archivo de datos centralizado para Poolera
import type { CategorySlug, Subscription, OrderStatus } from "@/lib/types";

export type Service = {
  id: string;
  name: string;
  logoId: string;
};

export const servicesByCategory: Record<CategorySlug, Service[]> = {
  streaming: [
    { id: "apple-tv-plus", name: "AppleTV+", logoId: "apple-tv-plus-logo" },
    { id: "directv-go", name: "DirecTVGO", logoId: "directv-go-logo" },
    { id: "disney-plus", name: "Disney+", logoId: "disney-plus-logo" },
    { id: "hbo-max", name: "HBO Max", logoId: "hbo-logo" },
    { id: "netflix", name: "Netflix", logoId: "netflix-logo" },
    { id: "prime-video", name: "PrimeVideo", logoId: "prime-video-logo" },
    { id: "paramount-plus", name: "Paramount+", logoId: "paramount-plus-logo" },
    { id: "crunchyroll", name: "Crunchyroll", logoId: "crunchyroll-logo" },
    { id: "youtube-premium", name: "YouTube Premium", logoId: "youtube-premium-logo" },
  ],
  musica: [
    { id: "spotify", name: "Spotify", logoId: "spotify-logo" },
    { id: "apple-music", name: "Apple Music", logoId: "apple-music-logo" },
    { id: "tidal", name: "Tidal", logoId: "tidal-logo" },
    { id: "youtube-music", name: "YouTube Music", logoId: "youtube-music-logo" },
  ],
  gaming: [
    { id: "ps-plus", name: "PS Plus", logoId: "ps-plus-logo" },
    { id: "xbox-game-pass", name: "Xbox Game Pass", logoId: "xbox-game-pass-logo" },
    { id: "nintendo-switch-online", name: "Nintendo Switch Online", logoId: "nintendo-switch-online-logo" },
  ],
   diseno: [
    { id: "canva", name: "Canva Pro", logoId: "canva-logo" },
    { id: "adobe-cc", name: "Adobe Creative Cloud", logoId: "adobe-cc-logo" },
  ],
  seguridad: [
      { id: "nordvpn", name: "NordVPN", logoId: "nordvpn-logo" },
      { id: "expressvpn", name: "ExpressVPN", logoId: "expressvpn-logo" },
  ],
  ia: [
    { id: "chatgpt-plus", name: "ChatGPT Plus", logoId: "chatgpt-logo" },
    { id: "midjourney", name: "Midjourney", logoId: "midjourney-logo" },
  ],
  educacion: [
    { id: "duolingo", name: "Duolingo", logoId: "duolingo-logo" },
    { id: "coursera", name: "Coursera", logoId: "coursera-logo" },
    { id: "platzi", name: "Platzi", logoId: "platzi-logo" },
  ],
  software: [
      { id: "microsoft-365", name: "Microsoft 365", logoId: "microsoft-365-logo" },
      { id: "setapp", name: "Setapp", logoId: "setapp-logo" },
  ],
  deportes: [
      { id: "nba-league-pass", name: "NBA League Pass", logoId: "nba-league-pass-logo" },
      { id: "star-plus-deportes", name: "Star+ (Deportes)", logoId: "star-plus-deportes-logo" },
  ],
  bienestar: [
      { id: "calm", name: "Calm", logoId: "calm-logo" },
      { id: "headspace", name: "Headspace", logoId: "headspace-logo" },
  ],
};

export const currentUser = {
  name: "Alex Thompson",
  email: "alex.t@example.com",
  phone: "+1 (555) 012-3456",
  memberSince: "Enero 2023",
  avatar: "https://picsum.photos/seed/alex/200/200",
  balance: 142.50,
  paymentMethods: [
    { id: "pm-1", type: "VISA", last4: "4242", isPrimary: true }
  ]
};

export const walletTransactions = [
  { id: "t1", title: "Netflix Premium Group", date: "Oct 12, 2023", amount: -4.50, category: "Suscripción", icon: "subscriptions" },
  { id: "t2", title: "Recarga de Billetera", date: "Oct 10, 2023", amount: 50.00, category: "Transferencia", icon: "add_card" },
  { id: "t3", title: "Spotify Family Plan", date: "Oct 08, 2023", amount: -3.20, category: "Suscripción", icon: "music_note" },
];

export const subscriptions: Subscription[] = [
  {
    id: "1",
    service: "Disney+",
    host: "Juanca10",
    price: 2.99,
    currency: "$",
    rating: 4.8,
    availableSlots: 2,
    totalSlots: 5,
    logoId: "disney-plus-logo",
    country: "Global",
    avatarUrl: "https://picsum.photos/seed/avatar1/100/100"
  },
  {
    id: "2",
    service: "Netflix",
    host: "SeriesFan",
    price: 4.50,
    currency: "$",
    rating: 4.7,
    availableSlots: 1,
    totalSlots: 2,
    logoId: "netflix-logo",
    country: "Global",
    avatarUrl: "https://picsum.photos/seed/avatar3/100/100"
  },
  {
    id: "3",
    service: "Spotify",
    host: "MusicLover",
    price: 3.20,
    currency: "$",
    rating: 5.0,
    availableSlots: 3,
    totalSlots: 6,
    logoId: "spotify-logo",
    country: "Global",
    avatarUrl: "https://picsum.photos/seed/avatar4/100/100"
  },
];

export type GroupRole = 'Anfitrión' | 'Miembro';

export type Group = {
  id: string;
  service: string;
  host: string;
  userRole: GroupRole;
  slots: {
    filled: number;
    total: number;
  };
  publicPrice: number;
  netEarning: number;
  status: 'Activo' | 'Incompleto';
  credentials: {
    email: string;
    pass: string;
  };
  nextBill: string;
};

export const groups: Group[] = [
    { 
      id: '1', 
      service: 'Netflix Premium', 
      host: 'Alex Chen',
      userRole: 'Anfitrión',
      slots: { filled: 3, total: 5 }, 
      publicPrice: 4.50, 
      netEarning: 4.05, 
      status: 'Activo',
      credentials: { email: "netflix-fam@poolera.com", pass: "SecurePass123!" },
      nextBill: "24 Oct"
    },
    { 
      id: '2', 
      service: 'Spotify Family', 
      host: 'Sarah Miller',
      userRole: 'Miembro',
      slots: { filled: 6, total: 6 }, 
      publicPrice: 3.20, 
      netEarning: 2.88, 
      status: 'Activo',
      credentials: { email: "spotify-pool@poolera.com", pass: "MusicRocks99!" },
      nextBill: "02 Nov"
    },
    { 
      id: '3', 
      service: 'Disney+ Yearly', 
      host: 'Jordan Lee',
      userRole: 'Anfitrión',
      slots: { filled: 1, total: 4 }, 
      publicPrice: 2.99, 
      netEarning: 2.69, 
      status: 'Incompleto',
      credentials: { email: "disney-yearly@poolera.com", pass: "Mickey2024!" },
      nextBill: "15 Dic"
    },
];

export type Order = {
  id: string;
  service: string;
  host: string;
  price: number;
  status: OrderStatus;
  expires: string;
};

export const orders: Order[] = [
    { id: 'order-1', service: 'Netflix Premium', host: 'Juanca10', price: 4.50, status: 'Activo', expires: '2024-08-15' },
    { id: 'order-2', service: 'Spotify Familiar', host: 'MusicLover22', price: 3.20, status: 'Activo', expires: '2024-08-20' },
    { id: 'order-3', service: 'HBO Max', host: 'CinefiloX', price: 3.50, status: 'En disputa', expires: '2024-08-10' },
];

export const getSubscriptionById = (id: string) => subscriptions.find(s => s.id === id);
export const getServiceById = (id: string) => {
  for (const cat in servicesByCategory) {
    const service = servicesByCategory[cat as CategorySlug].find(s => s.id === id);
    if (service) return service;
  }
  return null;
};
export const getSubscriptionsByService = (serviceId: string) => {
  const service = getServiceById(serviceId);
  if (!service) return [];
  return subscriptions.filter(s => s.service.toLowerCase().includes(service.name.toLowerCase()));
};
