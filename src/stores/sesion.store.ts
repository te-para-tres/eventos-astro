import { persistentAtom, persistentJSON } from "@nanostores/persistent";
import type { Estudiante } from "@/models/Estudiante.model";

export const $token = persistentAtom<string | undefined>("eventues-token");
export const $refreshToken = persistentAtom<string | undefined>("eventues-refresh-token");
export const $estudiante = persistentJSON<Partial<Estudiante> | undefined>("eventues-estudiante", undefined);

const MARGEN_EXPIRACION_SEGUNDOS = 60;

/** Lee `exp` del payload del JWT; un token ilegible se trata como expirado. */
export function tokenPorExpirar(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp - MARGEN_EXPIRACION_SEGUNDOS <= Date.now() / 1000;
  } catch {
    return true;
  }
}
