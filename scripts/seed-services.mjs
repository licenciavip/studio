/**
 * Carga inicial del catálogo de servicios en Firestore (colección `services`).
 *
 * Uso:
 *   export GOOGLE_APPLICATION_CREDENTIALS="/ruta/serviceAccountKey.json"
 *   node scripts/seed-services.mjs
 *
 * Es idempotente: vuelve a escribir los mismos documentos (merge), no duplica.
 * Luego puedes ajustar `maxSlots` y precios desde el panel admin → Servicios.
 */

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const SERVICES = [
  { id: "chatgpt",    name: "ChatGPT",    planName: "ChatGPT Plus",   color: "#10a37f", category: "ia", pricePerMonth: 26.90, hostEarnings: 75.52, maxSlots: 5 },
  { id: "claude",     name: "Claude Pro", planName: "Claude Pro",     color: "#d97757", category: "ia", pricePerMonth: 47.90, hostEarnings: 82.30, maxSlots: 5 },
  { id: "gemini",     name: "Gemini AI",  planName: "Gemini AI",      color: "#4285f4", category: "ia", pricePerMonth: 16.90, hostEarnings: 61.65, maxSlots: 6 },
  { id: "perplexity", name: "Perplexity", planName: "Perplexity Pro", color: "#0b1416", category: "ia", pricePerMonth: 47.90, hostEarnings: 78.40, maxSlots: 5 },
];

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("Falta GOOGLE_APPLICATION_CREDENTIALS apuntando a tu clave de servicio JSON.");
    process.exit(1);
  }
  initializeApp({ credential: applicationDefault() });
  const db = getFirestore();

  for (const s of SERVICES) {
    await db.collection("services").doc(s.id).set(
      { ...s, active: true, updatedAt: FieldValue.serverTimestamp(), createdAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
    console.log(`✅ ${s.name} (maxSlots ${s.maxSlots})`);
  }
  console.log("Catálogo cargado. Ajusta cupos/precios desde el panel admin → Servicios.");
  process.exit(0);
}

main().catch((e) => { console.error("Error:", e.message); process.exit(1); });
