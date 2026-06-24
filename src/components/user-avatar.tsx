"use client";

import { avatarUrl, colorFromText } from "@/lib/avatars";

/**
 * Avatar de usuario: muestra el avatar prediseñado (por semilla) o, si no hay,
 * un círculo con la inicial y un color estable.
 */
export function UserAvatar({
  name,
  seed,
  size = 40,
  className = "",
}: {
  name?: string | null;
  seed?: string | null;
  size?: number;
  className?: string;
}) {
  const label = (name || "?").trim();
  if (seed) {
    return (
      <img
        src={avatarUrl(seed)}
        alt={label}
        width={size}
        height={size}
        className={`rounded-full bg-white/60 object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white ${className}`}
      style={{ width: size, height: size, background: colorFromText(label), fontSize: size * 0.4 }}
    >
      {label.charAt(0).toUpperCase()}
    </div>
  );
}
