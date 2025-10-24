
// This file will be removed once Firebase is connected.
// It is used for placeholder data in the meantime.
import type { CategorySlug } from "@/lib/types";

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


// This file will be removed once Firebase is connected.
// It is used for placeholder data in the meantime.

export type Group = {
  id: string;
  service: string;
  slots: {
    filled: number;
    total: number;
  };
  publicPrice: number;
  netEarning: number;
  status: 'Activo' | 'Incompleto';
};

export const groups: Group[] = [
    { id: '1', service: 'Netflix Premium', slots: { filled: 3, total: 4 }, publicPrice: 9.50, netEarning: 8.55, status: 'Activo' },
    { id: '2', service: 'Spotify Familiar', slots: { filled: 5, total: 6 }, publicPrice: 5.00, netEarning: 4.50, status: 'Activo' },
    { id: '3', service: 'HBO Max', slots: { filled: 1, total: 3 }, publicPrice: 4.00, netEarning: 3.60, status: 'Incompleto' },
];


export type OrderStatus = 'Activo' | 'Pendiente' | 'En disputa' | 'Finalizado';

export type Order = {
  id: string;
  service: string;
  host: string;
  price: number;
  status: OrderStatus;
  expires: string;
};

export const orders: Order[] = [
    { id: 'order-1', service: 'Netflix Premium', host: 'Juanca10', price: 9.50, status: 'Activo', expires: '2024-08-15' },
    { id: 'order-2', service: 'Spotify Familiar', host: 'MusicLover22', price: 5.00, status: 'Activo', expires: '2024-08-20' },
    { id: 'order-3', service: 'HBO Max', host: 'CinefiloX', price: 4.00, status: 'En disputa', expires: '2024-08-10' },
    { id: 'order-4', service: 'Youtube Premium', host: 'AdFreeLife', price: 3.50, status: 'Finalizado', expires: '2024-07-25' },
];
