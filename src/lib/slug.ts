import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

/** Convierte "David Huamani" -> "david-huamani". */
export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "usuario"
  );
}

/**
 * Reserva un slug unico para el usuario en la coleccion `usernames`.
 * Si el slug base esta tomado por otra persona, prueba -2, -3, etc.
 * Devuelve el slug asignado (o el uid como respaldo).
 */
export async function reserveSlug(firestore: Firestore, uid: string, name: string): Promise<string> {
  const base = slugify(name);
  for (let i = 0; i < 25; i++) {
    const cand = i === 0 ? base : `${base}-${i + 1}`;
    const ref = doc(firestore, "usernames", cand);
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { uid });
        return cand;
      }
      if (snap.data().uid === uid) return cand;
    } catch {
      break;
    }
  }
  return uid;
}
