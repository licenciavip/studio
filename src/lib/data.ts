import type { CategorySlug, Subscription, OrderStatus, Service, Group, Order } from "@/lib/types";

export const servicesByCategory: Record<CategorySlug, Service[]> = {
  ia: [
    { id: "chatgpt", name: "ChatGPT", logoId: "chatgpt-logo", color: "#10a37f", pricePerMonth: "26.90", planName: "ChatGPT Plus" },
    { id: "claude", name: "Claude", logoId: "chatgpt-logo", color: "#d97757", pricePerMonth: "47.90", planName: "Claude Pro" },
    { id: "gemini", name: "Gemini", logoId: "chatgpt-logo", color: "#ffffff", pricePerMonth: "16.90", planName: "Gemini AI" },
    { id: "perplexity", name: "Perplexity", logoId: "chatgpt-logo", color: "#005a5a", pricePerMonth: "47.90", planName: "Perplexity Pro" },
  ],
  streaming: [],
  musica: [],
  educacion: [],
  gaming: [],
  diseno: [],
  seguridad: [],
  deportes: [],
  bienestar: [],
  software: [],
};

export const currentUser = {
  name: "Alex Thompson",
  email: "alex.t@example.com",
  avatar: "https://picsum.photos/seed/alex/200/200",
};

export const subscriptions: Subscription[] = [
  {
    id: "ia-1",
    service: "ChatGPT Plus",
    host: "IA_Master",
    price: 26.90,
    currency: "S/",
    rating: 4.9,
    availableSlots: 2,
    totalSlots: 5,
    logoId: "chatgpt-logo",
    country: "Global",
    avatarUrl: "https://picsum.photos/seed/ai1/100/100"
  },
];

export const groups: Group[] = [
  { 
    id: '1', 
    service: 'ChatGPT Plus', 
    host: 'Alex Thompson',
    userRole: 'Anfitrión',
    slots: { filled: 3, total: 5 }, 
    publicPrice: 26.90, 
    netEarning: 24.20, 
    status: 'Activo',
    credentials: { email: "ai-plus@subshare.com", pass: "AIsecure123!" },
    nextBill: "15 Ago"
  },
];

export const orders: Order[] = [
  { id: 'order-1', service: 'ChatGPT Plus', host: 'IA_Master', price: 26.90, status: 'Activo', expires: '2024-09-15' },
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
