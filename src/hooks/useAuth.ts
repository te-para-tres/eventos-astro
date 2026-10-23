import { useStore } from "@nanostores/react";
import { navigate } from "astro:transitions/client";
import { http } from "@/hooks/http";
import { Estudiante } from "@/models/Estudiante.model";
import type { IniciarSesionFormData } from "@/schemas/iniciarSesion.schema";
import type { RegistroFormData } from "@/schemas/registro.schema";
import { $estudiante, $refreshToken, $token, tokenPorExpirar } from "@/stores/sesion.store";

type Sesion = Partial<Estudiante> & { token: string; refreshToken: string };

function guardarSesion({ token, refreshToken, ...estudiante }: Sesion) {
  $token.set(token);
  $refreshToken.set(refreshToken);
  $estudiante.set(estudiante);
}

function limpiarSesion() {
  $token.set(undefined);
  $refreshToken.set(undefined);
  $estudiante.set(undefined);
}

async function enviarYGuardarSesion(endpoint: string, body: unknown) {
  const res = await http.post<Sesion>(endpoint, body);
  if (!res.isError && res.detalle) guardarSesion(res.detalle);
  return res;
}

function iniciarSesion(datos: IniciarSesionFormData) {
  return enviarYGuardarSesion(Estudiante.ENDPOINTS.INICIAR_SESION, datos);
}

function registrar({ confirmarClave, ...datos }: RegistroFormData) {
  return enviarYGuardarSesion(Estudiante.ENDPOINTS.REGISTRO, datos);
}

let refrescoEnCurso: Promise<boolean> | null = null;

/** Las llamadas simultáneas comparten la misma petición: el refresh token es de un solo uso. */
function refrescarToken(): Promise<boolean> {
  refrescoEnCurso ??= pedirTokenNuevo().finally(() => (refrescoEnCurso = null));
  return refrescoEnCurso;
}

/** Pide un token nuevo; si el refresh token ya no sirve, la sesión se cierra localmente. */
async function pedirTokenNuevo(): Promise<boolean> {
  const refreshToken = $refreshToken.get();
  if (!refreshToken) return false;

  try {
    const res = await enviarYGuardarSesion(Estudiante.ENDPOINTS.REFRESCAR_TOKEN, { refreshToken });
    if (!res.isError) return true;
    // Otra pestaña ya rotó el token: la sesión sigue viva
    if ($refreshToken.get() !== refreshToken) return true;
    limpiarSesion();
    return false;
  } catch {
    return false;
  }
}

/** Refresca solo si el token actual está por expirar. */
async function asegurarToken(): Promise<boolean> {
  const token = $token.get();
  if (!token) return false;
  return tokenPorExpirar(token) ? refrescarToken() : true;
}

function cerrarSesion() {
  const refreshToken = $refreshToken.get();
  if (refreshToken) {
    http.post(Estudiante.ENDPOINTS.CERRAR_SESION, { refreshToken }).catch(() => {});
  }
  limpiarSesion();
  navigate("/");
}

export function useAuth() {
  const usuario = useStore($estudiante);

  return { usuario, iniciarSesion, registrar, cerrarSesion, refrescarToken, asegurarToken };
}
