import React, { useState, useEffect, useCallback } from "react";
import { http } from "../../hooks/http";
import type { CarreraResponseItem, EventoResumen } from "../../models/catalogos.model";

const CARRERA_ENDPOINT = "api/carrera.json";

function formatearFecha(raw: string): string {
  const [year, month, day] = raw.split("T")[0].split("-").map(Number);
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${day} ${meses[month - 1]} ${year}`;
}

interface Props {
  id?: string;
}

const DetalleDepartamento: React.FC<Props> = ({ id }) => {
  const carreraId = id ?? window.location.pathname.split("/").pop() ?? "";

  const [carrera, setCarrera] = useState<CarreraResponseItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const obtenerCarrera = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await http.get<CarreraResponseItem[]>(
        `${CARRERA_ENDPOINT}?expand=eventos,unidadAcademica`
      );
      if (response.status === 200 && Array.isArray(response.resultado)) {
        const encontrada = response.resultado.find((c) => c.id === carreraId);
        encontrada ? setCarrera(encontrada) : setError(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error al obtener carrera:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [carreraId]);

  useEffect(() => {
    void obtenerCarrera();
  }, [obtenerCarrera]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <i className="fa-solid fa-spinner fa-spin text-primary text-3xl"></i>
      </div>
    );
  }

  if (error || !carrera) {
    return (
      <div className="flex flex-col items-center py-32 text-gray-400 gap-3">
        <i className="fa-solid fa-triangle-exclamation text-4xl"></i>
        <p className="font-semibold">No se encontró el departamento</p>
        <button
          onClick={() => (window.location.href = "/departamentos")}
          className="mt-2 text-sm text-primary underline cursor-pointer"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  const eventos: EventoResumen[] = carrera.eventos ?? [];
  const unidad = carrera.unidadAcademica;

  return (
    <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto">

      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-6">
        <span
          className="hover:text-primary cursor-pointer transition"
          onClick={() => (window.location.href = "/departamentos")}
        >
          Departamentos
        </span>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <span className="text-gray-700 font-medium truncate">{carrera.nombre}</span>
      </nav>

      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 lg:gap-8">

        <div className="xl:col-span-8 space-y-6">

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
              <i className="fa-solid fa-building text-xl sm:text-2xl"></i>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                {carrera.tipo ?? "—"}
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {carrera.nombre}
              </h1>
            </div>
          </div>

          {carrera.descripcion && (
            <div>
              <h2 className="font-bold text-base sm:text-lg text-gray-800 mb-2">DESCRIPCIÓN</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {carrera.descripcion}
              </p>
            </div>
          )}

          {eventos.length > 0 && (
            <div>
              <h2 className="font-bold text-base sm:text-lg text-gray-800 mb-3">
                PROGRAMAS ACADÉMICOS
              </h2>
              <div className="flex flex-col gap-2">
                {eventos.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => (window.location.href = `/eventos/${ev.id}`)}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border bg-gray-50 hover:shadow-sm transition cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-graduation-cap text-primary text-sm"></i>
                    </div>
                    <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-primary transition">
                      {ev.nombre ?? "Sin nombre"}
                    </span>
                    <i className="fa-solid fa-chevron-right text-gray-300 text-xs ml-auto group-hover:text-primary transition"></i>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="xl:col-span-4 space-y-5">

          <div className="p-5 border-t-4 border-primary rounded-xl shadow-md space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Contacto</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <i className="fa-regular fa-envelope text-primary w-4"></i>
                {unidad?.correo ?? `depto.${carrera.id}@ues.edu.sv`}
              </p>
              <p className="flex items-center gap-2">
                <i className="fa-solid fa-phone text-primary w-4"></i>
                {unidad?.telefono ?? "—"}
              </p>
              <p className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-primary w-4"></i>
                {unidad?.nombre ?? "UES"}
              </p>
            </div>
            <button className="w-full bg-black/75 text-white py-2.5 rounded-lg font-semibold hover:bg-primary transition flex items-center justify-center gap-2 text-sm cursor-pointer mt-2">
              Enviar mensaje
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>

          {eventos.length > 0 && (
            <div className="p-4 sm:p-5 rounded-xl border shadow-sm space-y-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Próximos eventos</p>
              <div className="flex flex-col gap-3">
                {eventos.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => (window.location.href = "/eventos")}
                    className="flex items-center gap-3 p-2.5 rounded-lg border hover:shadow-sm transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-calendar-days text-gray-400"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        {ev.fechaInicio ? formatearFecha(ev.fechaInicio) : "—"}
                      </p>
                      <p className="text-sm font-medium leading-snug truncate group-hover:text-primary transition">
                        {ev.nombre ?? "Sin nombre"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => (window.location.href = "/departamentos")}
            className="w-full border py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Ver todos los departamentos
          </button>

        </div>
      </div>
    </main>
  );
};

export default DetalleDepartamento;