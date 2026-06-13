'use client';

/**
 * @fileOverview Firebase client configuration.
 * Las keys se leen desde variables de entorno (NEXT_PUBLIC_*) configuradas en
 * Vercel y en .env.local. Las keys de Firebase Web no son secretas (viajan al
 * navegador), pero mantenerlas en env evita hardcodearlas y facilita cambiar
 * de proyecto sin tocar el código.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
