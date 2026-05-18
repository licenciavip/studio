
import type { CategorySlug, Subscription, OrderStatus, Service, Group, Order } from "@/lib/types";

export const servicesByCategory: Record<CategorySlug, Service[]> = {
  streaming: [
    { id: "netflix", name: "NETFLIX", logoId: "netflix-logo", color: "#e50914", discount: "-58%", pricePerMonth: "23.90", planName: "Netflix Premium" },
    { id: "disney-plus", name: "Disney+", logoId: "disney-plus-logo", color: "#1a364e", discount: "-57%", pricePerMonth: "22.90", planName: "Disney+ Premium" },
    { id: "hbo-max", name: "HBO max", logoId: "hbo-logo", color: "#000000", discount: "-63%", pricePerMonth: "20.90", planName: "HBO Max Platino" },
    { id: "youtube", name: "YouTube", logoId: "youtube-premium-logo", color: "#ff0000", discount: "-66%", pricePerMonth: "13.90", planName: "YouTube Premium" },
    { id: "prime-video", name: "prime video", logoId: "prime-video-logo", color: "#1e4a7a", discount: "-47%", pricePerMonth: "11.90", planName: "Prime Video" },
    { id: "paramount-plus", name: "Paramount+", logoId: "paramount-plus-logo", color: "#0064ff", discount: "-23%", pricePerMonth: "14.90", planName: "Paramount+" },
    { id: "crunchyroll", name: "crunchyroll", logoId: "crunchyroll-logo", color: "#f47521", discount: "-40%", pricePerMonth: "11.90", planName: "Crunchyroll" },
    { id: "apple-tv-plus", name: "Apple TV+", logoId: "apple-tv-plus-logo", color: "#000000", discount: "-64%", pricePerMonth: "13.90", planName: "Apple TV+" },
    { id: "atresplayer", name: "atresplayer", logoId: "atresplayer-logo", color: "#111111", discount: "-44%", pricePerMonth: "10.90", planName: "AtresPlayer" },
    { id: "curiosity", name: "Curiosity", logoId: "directv-go-logo", color: "#003049", discount: "-38%", pricePerMonth: "7.90", planName: "Curiosity Stream 4K" },
    { id: "masterclass", name: "MasterClass", logoId: "apple-tv-plus-logo", color: "#1a1a1a", discount: "-61%", pricePerMonth: "22.90", planName: "MasterClass" },
    { id: "mubi", name: "MUBI", logoId: "viki-logo", color: "#0020d1", discount: "-38%", pricePerMonth: "18.90", planName: "MUBI" },
    { id: "universal-plus", name: "UNIVERSAL+", logoId: "paramount-plus-logo", color: "#000000", discount: "-55%", pricePerMonth: "11.90", planName: "Universal+ Premium" },
    { id: "viki", name: "VIKI", logoId: "viki-logo", color: "#1da1f2", discount: "-44%", pricePerMonth: "12.90", planName: "VIKI Pass" },
    { id: "vix", name: "ViX", logoId: "vix-logo", color: "#f58220", discount: "-65%", pricePerMonth: "11.90", planName: "ViX Premium" },
    { id: "wow", name: "WOW", logoId: "wow-logo", color: "#ff0099", discount: "-21%", pricePerMonth: "9.90", planName: "WOW Presents Plus" },
  ],
  musica: [
    { id: "spotify", name: "Spotify", logoId: "spotify-logo", color: "#121212", discount: "-67%", pricePerMonth: "13.90", planName: "Spotify Premium" },
    { id: "amazon-music", name: "Amazon Mus", logoId: "prime-video-logo", color: "#25d1da", discount: "-53%", pricePerMonth: "10.90", planName: "Amazon Music" },
    { id: "apple-music", name: "Apple Music", logoId: "apple-music-logo", color: "#fb233b", discount: "-70%", pricePerMonth: "13.90", planName: "Apple Music" },
    { id: "apple-one", name: "Apple One", logoId: "apple-tv-plus-logo", color: "#000000", discount: "-81%", pricePerMonth: "18.90", planName: "Apple One" },
    { id: "deezer", name: "Deezer", logoId: "viki-logo", color: "#121212", discount: "-74%", pricePerMonth: "10.90", planName: "Deezer Premium" },
    { id: "tidal", name: "TIDAL", logoId: "tidal-logo", color: "#000000", discount: "-70%", pricePerMonth: "11.90", planName: "Tidal HiFi" },
    { id: "youtube-music", name: "YT Music", logoId: "youtube-music-logo", color: "#ff0000", discount: "-78%", pricePerMonth: "9.90", planName: "YouTube Music" },
  ],
  gaming: [
    { id: "ps-plus", name: "PS Plus", logoId: "ps-plus-logo", color: "#003791", pricePerMonth: "39.90" },
    { id: "xbox-game-pass", name: "Xbox Game Pass", logoId: "xbox-game-pass-logo", color: "#107c10", pricePerMonth: "29.90" },
    { id: "nintendo-switch-online", name: "Nintendo Switch Online", logoId: "nintendo-switch-online-logo", color: "#e60012", pricePerMonth: "15.00" },
  ],
   diseno: [
    { id: "canva", name: "Canva Pro", logoId: "canva-logo", color: "#00c4cc", pricePerMonth: "12.90" },
    { id: "adobe-cc", name: "Adobe Creative Cloud", logoId: "adobe-cc-logo", color: "#ff0000", pricePerMonth: "89.90" },
  ],
  seguridad: [
      { id: "nordvpn", name: "NordVPN", logoId: "nordvpn-logo", color: "#003566", pricePerMonth: "14.90" },
      { id: "expressvpn", name: "ExpressVPN", logoId: "expressvpn-logo", color: "#ff1e1e", pricePerMonth: "15.90" },
  ],
  ia: [
    { id: "chatgpt-plus", name: "ChatGPT Plus", logoId: "chatgpt-logo", color: "#10a37f", pricePerMonth: "20.00" },
    { id: "midjourney", name: "Midjourney", logoId: "midjourney-logo", color: "#000000", pricePerMonth: "10.00" },
  ],
  educacion: [
    { id: "duolingo", name: "Duolingo", logoId: "duolingo-logo", color: "#58cc02", pricePerMonth: "9.90" },
    { id: "coursera", name: "Coursera", logoId: "coursera-logo", color: "#0056d2", pricePerMonth: "19.90" },
    { id: "platzi", name: "Platzi", logoId: "platzi-logo", color: "#98ca3f", pricePerMonth: "15.90" },
  ],
  software: [
      { id: "microsoft-365", name: "Microsoft 365", logoId: "microsoft-365-logo", color: "#d83b01", pricePerMonth: "12.90" },
      { id: "setapp", name: "Setapp", logoId: "setapp-logo", color: "#000000", pricePerMonth: "9.99" },
  ],
  deportes: [
      { id: "nba-league-pass", name: "NBA League Pass", logoId: "nba-league-pass-logo", color: "#17408b", pricePerMonth: "25.90" },
      { id: "star-plus-deportes", name: "Star+ (Deportes)", logoId: "star-plus-deportes-logo", color: "#1a364e", pricePerMonth: "22.90" },
  ],
  bienestar: [
      { id: "calm", name: "Calm", logoId: "calm-logo", color: "#45b1e8", pricePerMonth: "5.90" },
      { id: "headspace", name: "Headspace", logoId: "headspace-logo", color: "#ff8c00", pricePerMonth: "5.90" },
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
    service: "Disney+ Premium",
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
    service: "Netflix 4K HDR",
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
    service: "Spotify Family",
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
  {
    id: "4",
    service: "ChatGPT Plus",
    host: "TechGuru",
    price: 5.00,
    currency: "$",
    rating: 4.9,
    availableSlots: 2,
    totalSlots: 5,
    logoId: "chatgpt-logo",
    country: "Global",
    avatarUrl: "https://picsum.photos/seed/avatar5/100/100"
  },
  {
    id: "5",
    service: "Canva Pro Team",
    host: "DesignerMax",
    price: 3.50,
    currency: "$",
    rating: 4.6,
    availableSlots: 4,
    totalSlots: 5,
    logoId: "canva-logo",
    country: "Global",
    avatarUrl: "https://picsum.photos/seed/avatar6/100/100"
  },
];

export type GroupRole = 'Anfitrión' | 'Miembro';

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
