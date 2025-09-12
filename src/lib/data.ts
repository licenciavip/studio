import type { Subscription, Order, Group } from './types';

export const subscriptions: Subscription[] = [
  {
    id: '1',
    service: 'Netflix',
    price: 9.99,
    totalSlots: 4,
    availableSlots: 2,
    rating: 4.8,
    country: 'Perú',
    host: 'Juan Perez',
    logoId: 'netflix-logo'
  },
  {
    id: '2',
    service: 'Spotify',
    price: 4.50,
    totalSlots: 6,
    availableSlots: 1,
    rating: 4.9,
    country: 'LatAm',
    host: 'Maria Garcia',
    logoId: 'spotify-logo'
  },
  {
    id: '3',
    service: 'ChatGPT',
    price: 10.00,
    totalSlots: 2,
    availableSlots: 1,
    rating: 4.5,
    country: 'LatAm',
    host: 'Carlos R.',
    logoId: 'chatgpt-logo'
  },
  {
    id: '4',
    service: 'Disney+',
    price: 5.00,
    totalSlots: 4,
    availableSlots: 3,
    rating: 4.7,
    country: 'Perú',
    host: 'Ana Lopez',
    logoId: 'disney-plus-logo'
  },
  {
    id: '5',
    service: 'HBO Max',
    price: 6.50,
    totalSlots: 3,
    availableSlots: 0,
    rating: 4.6,
    country: 'LatAm',
    host: 'Luis F.',
    logoId: 'hbo-logo'
  },
  {
    id: '6',
    service: 'YouTube Premium',
    price: 4.00,
    totalSlots: 5,
    availableSlots: 2,
    rating: 4.9,
    country: 'Perú',
    host: 'Sofia T.',
    logoId: 'youtube-premium-logo'
  },
    {
    id: '7',
    service: 'Netflix',
    price: 11.50,
    totalSlots: 4,
    availableSlots: 1,
    rating: 5.0,
    country: 'LatAm',
    host: 'Diego H.',
    logoId: 'netflix-logo'
  },
    {
    id: '8',
    service: 'Spotify',
    price: 3.99,
    totalSlots: 6,
    availableSlots: 5,
    rating: 4.8,
    country: 'Perú',
    host: 'Valeria C.',
    logoId: 'spotify-logo'
  }
];

export const orders: Order[] = [
  {
    id: 'ord-001',
    subscriptionId: '1',
    service: 'Netflix',
    host: 'Juan Perez',
    price: 9.99,
    status: 'Activo',
    expires: '2024-08-15',
    logoId: 'netflix-logo'
  },
  {
    id: 'ord-002',
    subscriptionId: '3',
    service: 'ChatGPT',
    host: 'Carlos R.',
    price: 10.00,
    status: 'Pendiente',
    expires: '2024-08-20',
    logoId: 'chatgpt-logo'
  },
    {
    id: 'ord-003',
    subscriptionId: '4',
    service: 'Disney+',
    host: 'Ana Lopez',
    price: 5.00,
    status: 'En disputa',
    expires: '2024-08-10',
    logoId: 'disney-plus-logo'
  },
    {
    id: 'ord-004',
    subscriptionId: '6',
    service: 'YouTube Premium',
    host: 'Sofia T.',
    price: 4.00,
    status: 'Finalizado',
    expires: '2024-07-25',
    logoId: 'youtube-premium-logo'
  }
];

export const groups: Group[] = [
  {
    id: 'grp-001',
    service: 'Netflix',
    slots: { total: 4, filled: 2 },
    publicPrice: 9.99,
    netEarning: 8.99,
    status: 'Incompleto',
  },
  {
    id: 'grp-002',
    service: 'Spotify',
    slots: { total: 6, filled: 6 },
    publicPrice: 4.50,
    netEarning: 4.05,
    status: 'Activo',
  },
  {
    id: 'grp-003',
    service: 'Disney+',
    slots: { total: 4, filled: 1 },
    publicPrice: 5.00,
    netEarning: 4.50,
    status: 'Incompleto',
  }
];

export function getSubscriptionById(id: string | number): Subscription | undefined {
    return subscriptions.find(sub => sub.id === String(id));
}

export function getOrderById(id: string | number): Order | undefined {
    return orders.find(order => order.id === String(id));
}
