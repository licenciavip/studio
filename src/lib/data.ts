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
    { id: "vix", name: "ViX", logoId: "vix-logo", color: "#f58220", discount: "-65%", pricePerMonth: "11.90", planName: "ViX Premium" },
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
  software: [
    { id: "dropbox", name: "Dropbox", logoId: "setapp-logo", color: "#0061ff", discount: "-52%", pricePerMonth: "16.90", planName: "Dropbox Plus" },
    { id: "google-one", name: "Google One", logoId: "chatgpt-logo", color: "#ffffff", discount: "-67%", pricePerMonth: "11.90", planName: "Google One 2TB" },
    { id: "microsoft-365", name: "Microsoft", logoId: "microsoft-365-logo", color: "#f25022", discount: "-74%", pricePerMonth: "11.90", planName: "Microsoft 365" },
  ],
  deportes: [
    { id: "dazn", name: "DAZN", logoId: "vix-logo", color: "#000000", discount: "-11%", pricePerMonth: "23.90", planName: "DAZN Estándar" },
    { id: "f1-tv", name: "F1 TV", logoId: "paramount-plus-logo", color: "#e10600", discount: "-67%", pricePerMonth: "13.90", planName: "F1 TV Pro" },
    { id: "nba", name: "NBA", logoId: "nba-league-pass-logo", color: "#17408b", discount: "-37%", pricePerMonth: "28.90", planName: "NBA League Pass" },
  ],
  educacion: [
    { id: "duolingo", name: "Duolingo", logoId: "duolingo-logo", color: "#58cc02", discount: "-76%", pricePerMonth: "18.90", planName: "Duolingo Plus" },
    { id: "platzi", name: "Platzi", logoId: "platzi-logo", color: "#00223e", discount: "-61%", pricePerMonth: "36.90", planName: "Platzi" },
    { id: "scribd", name: "Scribd", logoId: "coursera-logo", color: "#1a1a1a", discount: "-67%", pricePerMonth: "11.90", planName: "Scribd" },
  ],
  diseno: [
    { id: "canva", name: "Canva Pro", logoId: "canva-logo", color: "#7d2ae8", discount: "-48%", pricePerMonth: "14.90", planName: "Canva Pro" },
    { id: "capcut", name: "CapCut", logoId: "midjourney-logo", color: "#000000", discount: "-51%", pricePerMonth: "17.90", planName: "CapCut Pro" },
  ],
  gaming: [
    { id: "ps-plus", name: "PS Plus", logoId: "ps-plus-logo", color: "#003791", pricePerMonth: "39.90" },
    { id: "xbox-game-pass", name: "Xbox Game Pass", logoId: "xbox-game-pass-logo", color: "#107c10", pricePerMonth: "29.90" },
    { id: "nintendo-switch-online", name: "Nintendo Switch Online", logoId: "nintendo-switch-online-logo", color: "#e60012", pricePerMonth: "15.00" },
  ],
  ia: [
    { id: "chatgpt-plus", name: "ChatGPT Plus", logoId: "chatgpt-logo", color: "#10a37f", pricePerMonth: "20.00" },
    { id: "midjourney", name: "Midjourney", logoId: "midjourney-logo", color: "#000000", pricePerMonth: "10.00" },
  ],
  seguridad: [
    { id: "nordvpn", name: "NordVPN", logoId: "nordvpn-logo", color: "#003566", pricePerMonth: "14.90" },
  ],
  bienestar: [
    { id: "calm", name: "Calm", logoId: "calm-logo", color: "#45b1e8", pricePerMonth: "5.90" },
  ],
};

export const currentUser = {
  name: "Alex Thompson",
  email: "alex.t@example.com",
  avatar: "https://picsum.photos/seed/alex/200/200",
};

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
];

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
];

export const orders: Order[] = [
  { id: 'order-1', service: 'Netflix Premium', host: 'Juanca10', price: 4.50, status: 'Activo', expires: '2024-08-15' },
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
