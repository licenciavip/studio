/**
 * Avatares prediseñados (sin Storage). Se renderiza un SVG ilustrado de DiceBear
 * a partir de una "semilla". Guardamos solo la semilla en el perfil.
 */

export const AVATAR_SEEDS = [
  "Poolera", "Aneka", "Felix", "Luna", "Mateo", "Sora",
  "Kai", "Mia", "Leo", "Noa", "Zoe", "Theo",
];

const STYLE = "fun-emoji";

export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/${STYLE}/svg?seed=${encodeURIComponent(seed)}`;
}

/** Color de fondo estable a partir de un texto (para el fallback de iniciales). */
export function colorFromText(text: string): string {
  const colors = ["#0A84FF", "#5E5CE6", "#30D158", "#FF9F0A", "#FF453A", "#BF5AF2", "#64D2FF", "#FF375F"];
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % colors.length;
  return colors[Math.abs(h)];
}
