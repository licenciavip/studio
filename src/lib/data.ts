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
  {
    id: "ia-2",
    service: "ChatGPT Plus",
    host: "TechPro_PE",
    price: 24.90,
    currency: "S/",
    rating: 4.7,
    availableSlots: 3,
    totalSlots: 5,
    logoId: "chatgpt-logo",
    country: "Peru",
    avatarUrl: "https://picsum.photos/seed/ai2/100/100"
  },
  {
    id: "ia-3",
    service: "Claude Pro",
    host: "ClaudeHost",
    price: 47.90,
    currency: "S/",
    rating: 4.8,
    availableSlots: 1,
    totalSlots: 3,
    logoId: "chatgpt-logo",
    country: "Global",
    avatarUrl: "https://picsum.photos/seed/ai3/100/100"
  },
  {
    id: "ia-4",
    service: "Gemini AI",
    host: "GoogleFan",
    price: 16.90,
    currency: "S/",
    rating: 4.6,
    availableSlots: 4,
    totalSlots: 5,
    logoId: "chatgpt-logo",
    country: "Global",
    avatarUrl: "https://picsum.photos/seed/ai4/100/100"
  },
  {
    id: "ia-5",
    service: "Perplexity Pro",
    host: "SearchMaster",
    price: 47.90,
    currency: "S/",
    rating: 4.9,
    availableSlots: 2,
    totalSlots: 4,
    logoId: "chatgpt-logo",
    country: "Global",
    avatarUrl: "https://picsum.photos/seed/ai5/100/100"
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
  {
    id: '2',
    service: 'Claude Pro',
    host: 'ClaudeHost',
    userRole: 'Miembro',
    slots: { filled: 2, total: 3 },
    publicPrice: 47.90,
    netEarning: 0,
    status: 'Activo',
    credentials: { email: "claude-share@poolera.com", pass: "Claude2024!" },
    nextBill: "20 Ago"
  },
  {
    id: '3',
    service: 'Gemini AI',
    host: 'GoogleFan',
    userRole: 'Miembro',
    slots: { filled: 4, total: 5 },
    publicPrice: 16.90,
    netEarning: 0,
    status: 'Incompleto',
    credentials: { email: "gemini-pool@poolera.com", pass: "Gemini2024!" },
    nextBill: "25 Ago"
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