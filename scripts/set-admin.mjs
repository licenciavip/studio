/**
 * Asigna o retira la custom claim `admin: true` a una cuenta de Firebase Auth.
 *
 * La custom claim es la ÚNICA fuente de autorización del panel. Solo puede
 * asignarse desde un entorno seguro con el Admin SDK (este script), nunca
 * desde el cliente.
 *
 * ── Requisitos ───────────────────────────────────────────────────────────
 *  1. npm install firebase-admin
 *  2. Descarga una clave de servicio:
 *     Firebase Console → ⚙️ Configuración del proyecto → Cuentas de servicio
 *     → "Generar nueva clave privada" → guarda el archivo JSON FUERA del repo.
 *  3. Exporta la ruta a esa clave (NO la subas a git):
 *       export GOOGLE_APPLICATION_CREDENTIALS="/ruta/serviceAccountKey.json"
 *
 * ── Uso ──────────────────────────────────────────────────────────────────
 *   node scripts/set-admin.mjs <email|uid>            # asignar admin
 *   node scripts/set-admin.mjs <email|uid> --remove   # retirar admin
 *
 * Ejemplos:
 *   node scripts/set-admin.mjs admin@poolera.com
 *   node scripts/set-admin.mjs admin@poolera.com --remove
 *
 * ── Importante ─────────────────────────────────────────────────────────────
 * Tras asignar/retirar el permiso, el administrador debe CERRAR SESIÓN e
 * INICIAR de nuevo (o esperar a que su ID token se renueve) para que el cambio
 * tenga efecto. El token solo refleja claims nuevas tras refrescarse.
 */

import admin from "firebase-admin";

async function main() {
  const target = process.argv[2];
  const remove = process.argv.includes("--remove");

  if (!target) {
    console.error("Uso: node scripts/set-admin.mjs <email|uid> [--remove]");
    process.exit(1);
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("Falta GOOGLE_APPLICATION_CREDENTIALS apuntando a tu clave de servicio JSON.");
    process.exit(1);
  }

  admin.initializeApp({ credential: admin.credential.applicationDefault() });

  // Resolver el usuario por email o por uid.
  const user = target.includes("@")
    ? await admin.auth().getUserByEmail(target)
    : await admin.auth().getUser(target);

  // Conservar claims previas y solo togglear `admin`.
  const claims = { ...(user.customClaims ?? {}) };
  if (remove) {
    delete claims.admin;
  } else {
    claims.admin = true;
  }

  await admin.auth().setCustomUserClaims(user.uid, claims);

  console.log(
    remove
      ? `✅ Permiso de admin RETIRADO a ${user.email ?? user.uid}`
      : `✅ Permiso de admin ASIGNADO a ${user.email ?? user.uid}`
  );
  console.log("⚠️  El usuario debe cerrar sesión e iniciar de nuevo para que el cambio tome efecto.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
