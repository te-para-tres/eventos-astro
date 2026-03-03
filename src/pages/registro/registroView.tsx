import { useCallback, useEffect, useState } from "react";
import { registroSchema } from "../../shemas/registroSchema";
import { navigate } from "astro/virtual-modules/transitions-router.js";

interface ErroresI {
  correo?: string;
  clave?: string;
}

const RegistroView: React.FC = () => {
  const [cargando, setCargando] = useState<boolean>(false);
  const [errores, setErrores] = useState<ErroresI>();

  return (
    <main className="min-h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-[45%_55%]">

      {/* ── Panel izquierdo ── */}
      <section className="relative flex flex-col justify-end overflow-hidden bg-primary px-10 py-14 md:px-14 md:py-20 min-h-[260px] lg:min-h-0">

        {/* Capa de sombra interior superior */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,0.28)_0%,transparent_55%)]" />

        {/* Círculo decorativo grande — esquina superior derecha */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-[22rem] h-[22rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -top-8 -right-8 w-[14rem] h-[14rem] rounded-full border border-white/[0.07]" />

        {/* Punto de acento — esquina inferior izquierda */}
        <div className="pointer-events-none absolute bottom-12 left-10 w-2 h-2 rounded-full bg-white/30" />
        <div className="pointer-events-none absolute bottom-20 left-14 w-1 h-1 rounded-full bg-white/20" />

        {/* Contenido */}
        <div className="relative z-10 max-w-[36ch]">
          <span className="mb-6 inline-block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/50">
            Universidad Estatal de Sonora
          </span>

          <h1 className="mb-4 text-[clamp(1.8rem,3vw,2.75rem)] font-bold leading-[1.08] tracking-tight text-text-light">
            Crea tu cuenta <br />
            <em className="not-italic text-white/60">gratis</em>
          </h1>

          <div className="mb-5 h-px w-8 bg-white/30" />

          <p className="text-[0.9rem] leading-relaxed text-white/65">
            Explora los eventos más relevantes de la Universidad Estatal de Sonora
          </p>
        </div>
      </section>

      {/* ── Panel derecho — Formulario ── */}
      <section className="flex items-center justify-center bg-bg-card px-6 py-14 md:px-12 md:py-20">
        <div className="w-full max-w-[400px]">

          {/* Cabecera */}
          <div className="mb-9">
            <p className="mb-3 text-[0.83rem] text-text-muted">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/iniciar-sesion"
                className="font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover hover:underline"
              >
                Iniciar sesión
              </a>
            </p>
            <h2 className="text-[1.65rem] font-bold tracking-tight text-text-main">
              Registrarse
            </h2>
            <div className="mt-2.5 h-[2px] w-7 rounded-full bg-primary" />
          </div>

          {/* Formulario */}
          <form className="flex flex-col gap-5">

            {/* Campo correo */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="correo"
                className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-text-muted"
              >
                Correo electrónico{" "}
                <span className="text-primary">*</span>
              </label>
              <input
                id="correo"
                name="correo"
                placeholder="ejemplo@gmail.com"
                className={[
                  "w-full rounded-lg border bg-bg-main px-4 py-[0.78rem] text-[0.9rem] text-text-main outline-none transition-all duration-200 placeholder:text-text-muted/50",
                  "focus:ring-2",
                  errores?.correo
                    ? "border-primary ring-2 ring-primary/15"
                    : "border-border-custom hover:border-text-muted/40 focus:border-primary focus:ring-primary/15",
                ].join(" ")}
              />
              {errores?.correo && (
                <p className="flex items-center gap-1.5 text-[0.78rem] font-medium text-primary">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {errores.correo}
                </p>
              )}
            </div>

            {/* Campo contraseña */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="clave"
                className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-text-muted"
              >
                Contraseña{" "}
                <span className="text-primary">*</span>
              </label>
              <input
                id="clave"
                type="password"
                name="clave"
                placeholder="••••••••"
                className={[
                  "w-full rounded-lg border bg-bg-main px-4 py-[0.78rem] text-[0.9rem] text-text-main outline-none transition-all duration-200 placeholder:text-text-muted/40",
                  "focus:ring-2",
                  errores?.clave
                    ? "border-primary ring-2 ring-primary/15"
                    : "border-border-custom hover:border-text-muted/40 focus:border-primary focus:ring-primary/15",
                ].join(" ")}
              />
              {errores?.clave && (
                <p className="flex items-center gap-1.5 text-[0.78rem] font-medium text-primary">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {errores.clave}
                </p>
              )}
            </div>

            {/* Botón submit */}
            <button
              disabled={cargando}
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-[0.85rem] text-[0.9rem] font-semibold text-text-light transition-all duration-200 hover:enabled:bg-primary-hover hover:enabled:-translate-y-px hover:enabled:shadow-[0_4px_16px_rgba(123,22,62,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creando cuenta…
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>

          </form>
        </div>
      </section>

    </main>
  );
};

export default RegistroView;
