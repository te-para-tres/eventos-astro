import { useCallback, useEffect, useState } from "react";
import { registroSchema } from "../../shemas/registroSchema";
import { navigate } from "astro/virtual-modules/transitions-router.js";
interface ErroresI {
  correo?: string;
  clave?: string;
}

const IniciarSesionView: React.FC = () => {
  const [cargando, setCargando] = useState<boolean>(false);
  const [errores, setErrores] = useState<ErroresI>();


  return (
    <main className="grid grid-cols-1 md:grid-cols-[minmax(280px,1fr)_minmax(320px,520px)] w-full min-h-[calc(100vh-100px)] bg-bg-alt shadow-[0_20px_50px_rgba(17,24,39,0.12)] bg-[radial-gradient(circle_at_20%_20%,rgba(139,28,40,0.12),transparent_45%),radial-gradient(circle_at_90%_90%,rgba(59,130,246,0.1),transparent_35%)]">
      <section className="flex flex-col justify-center items-start p-8 md:p-16 text-text-light bg-[linear-gradient(78deg,rgba(133,64,64,1)_16%,rgba(150,112,111,1)_54%,rgba(133,64,64,1)_100%)]">
        <h1 className="mb-4 text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em]">Bienvenido de nuevo</h1>
        <p className="m-0 max-w-[38ch] font-medium leading-relaxed text-white/90">
          Inicia sesión para ver y gestionar los eventos de la Universidad Estatal de Sonora
        </p>
      </section>
      <form className="flex flex-col justify-start gap-1 p-8 md:p-12 bg-bg-card">
        <p className="mb-2 text-[0.92rem] text-text-muted">
          ¿Aún no tienes cuenta?{" "}
          <a className="text-primary font-semibold no-underline hover:text-primary-hover hover:underline transition-colors" href="/registro">
            Regístrate
          </a>
        </p>
        <h1 className="mb-4 text-text-main text-[1.7rem] font-bold">Iniciar sesión</h1>

        <label htmlFor="correo" className="mt-2 text-[0.93rem] font-semibold text-text-main">
          Correo electrónico
        </label>
        <input
          type="email"
          name="correo"
          id="correo"
          placeholder="Ej. ejemplo@gmail.com"
          className="w-full border border-border-custom rounded-[0.55rem] px-[0.95rem] py-3 text-text-main bg-bg-main outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 placeholder:text-text-muted"
        />
        {errores?.correo && <p className="mt-1 text-primary text-[0.82rem] font-medium">{errores.correo}</p>}

        <label htmlFor="clave" className="mt-2 text-[0.93rem] font-semibold text-text-main">
          Contraseña
        </label>
        <input
          type="password"
          name="clave"
          id="clave"
          className="w-full border border-border-custom rounded-[0.55rem] px-[0.95rem] py-3 text-text-main bg-bg-main outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 placeholder:text-text-muted"
        />
        {errores?.clave && <p className="mt-1 text-primary text-[0.82rem] font-medium">{errores.clave}</p>}

        <button disabled={cargando} type="submit" className="w-full mt-6 bg-primary text-text-light rounded-[0.6rem] px-[1.1rem] py-[0.88rem] text-base font-bold transition-all duration-200 hover:enabled:bg-primary-hover hover:enabled:-translate-y-px disabled:opacity-75 disabled:cursor-not-allowed">
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </main>

  )
}

export default IniciarSesionView;
