import type { CategorySlug, Subscription, OrderStatus, Service, Group, Order } from "@/lib/types";

export const servicesByCategory: Record<CategorySlug, Service[]> = {
  ia: [
    { 
      id: "chatgpt", 
      name: "ChatGPT", 
      logoId: "chatgpt-logo", 
      color: "#10a37f", 
      pricePerMonth: "26.90", 
      hostEarnings: "75.52",
      planName: "ChatGPT Plus", 
      discount: "-58%" 
    },
    { 
      id: "claude", 
      name: "Claude Pro", 
      logoId: "chatgpt-logo", 
      color: "#d97757", 
      pricePerMonth: "47.90", 
      hostEarnings: "82.30",
      planName: "Claude Pro", 
      discount: "-32%" 
    },
    { 
      id: "gemini", 
      name: "Gemini AI", 
      logoId: "chatgpt-logo", 
      color: "#4285f4", 
      pricePerMonth: "16.90", 
      hostEarnings: "61.65",
      planName: "Gemini AI", 
      discount: "-65%" 
    },
    { 
      id: "perplexity", 
      name: "Perplexity", 
      logoId: "chatgpt-logo", 
      color: "#0b1416", 
      pricePerMonth: "47.90", 
      hostEarnings: "78.40",
      planName: "Perplexity Pro", 
      discount: "-46%" 
    },
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
  name: "Deyvid",
  email: "deyvid@example.com",
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
    host: 'Deyvid',
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