import React, { useState, useEffect, useCallback } from "react";
import { API_URL, http } from "../../hooks/http";
import { Evento } from "../../models/Evento.model";
import { Progress } from "../../components/ui/Progress";

function formatDateLabel(fechaInicio?: string, fechaFin?: string): string {
  if (!fechaInicio) return "";
  const inicio = new Date(fechaInicio);
  const dia = inicio.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
  const horaInicio = inicio.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  if (!fechaFin) return `${dia}, ${horaInicio}`;
  const fin = new Date(fechaFin);
  const horaFin = fin.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  return `${dia}, ${horaInicio} – ${horaFin}`;
}

function formatDateLong(fecha?: string): string {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimeRange(fechaInicio?: string, fechaFin?: string): string {
  if (!fechaInicio || !fechaFin) return "";
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  return `${fmt(inicio)} — ${fmt(fin)} (MST)`;
}

const EventosView: React.FC = () => {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmados, setConfirmados] = useState(0);
  const [confirmado, setConfirmado] = useState(false);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [toastCancelacion, setToastCancelacion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [countAnimating, setCountAnimating] = useState(false);

  const capacidad = evento?.capacidadMaxima ?? 200;
  const porcentaje = (confirmados / capacidad) * 100;
  const lleno = confirmados >= capacidad && !confirmado;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const obtenerEvento = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const idEvento = params.get("id");

      const response = await http.get<Evento[]>(
        `${Evento.ENDPOINTS.DEFAULT}${idEvento ? `?id=${idEvento}&` : "?"}expand=${Evento.EXPAND.DEFAULT}&limite=1`
      );

      if (response.status === 200 && Array.isArray(response.resultado) && response.resultado.length > 0) {
        const rawData = response.resultado[0] as Record<string, unknown>;
        const eventoInstancia = new Evento(rawData as Partial<Evento>);
        setEvento(eventoInstancia);
        setConfirmados(eventoInstancia.capacidadMinima ?? 42);
      }
    } catch (error) {
      console.error("Error al obtener evento:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void obtenerEvento();
  }, [obtenerEvento]);

  const animateCount = () => {
    setCountAnimating(true);
    setTimeout(() => setCountAnimating(false), 400);
  };

  const handleConfirmar = () => {
    if (lleno) return;
    setToastCancelacion(false);
    setConfirmado(true);
    setConfirmados((prev) => prev + 1);
    animateCount();
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 4000);
  };

  const handleCancelar = () => {
    setMostrarToast(false);
    setConfirmado(false);
    setConfirmados((prev) => prev - 1);
    animateCount();
    setToastCancelacion(true);
    setTimeout(() => setToastCancelacion(false), 4000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-primary"></i>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400 gap-3">
        <i className="fa-solid fa-calendar-xmark text-4xl"></i>
        <p className="text-sm">No se encontró el evento.</p>
      </div>
    );
  }

  const imagenSrc = evento.imagenDestacada?.ruta
    ? `${API_URL}recursos${evento.imagenDestacada.ruta}`
    : "/img/image.png";

  const fechaLarga = formatDateLong(evento.fechaInicio);
  const horaRango = formatTimeRange(evento.fechaInicio, evento.fechaFin);
  const ubicacion = evento.lugar
    ? `${evento.lugar}${evento.unidadAcademica ? `, ${evento.unidadAcademica.nombre}` : ""}`
    : evento.unidadAcademica?.nombre ?? "Pendiente";

  const categoriaNombre = evento.categoriaEvento?.nombre ?? "Evento";

  return (
    <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 max-w-7xl mx-auto">

      <div className={visible ? "page-enter" : "opacity-0"}>
        <section className="flex flex-col xl:grid xl:grid-cols-12 gap-6 lg:gap-8">

          <div className="xl:col-span-8 space-y-5 sm:space-y-6">
            <div
              className="overflow-hidden rounded-xl shadow-md"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.97)", transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s" }}
            >
              <img
                src={imagenSrc}
                alt={evento.nombre ?? "Evento"}
                className="w-full h-44 sm:h-64 md:h-80 lg:h-105 object-cover"
                style={{ transition: "transform 0.4s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>

            <h1
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary leading-tight"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s" }}
            >
              {evento.nombre}
            </h1>

            <div
              className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600"
              style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}
            >
              <p className="flex items-center gap-2 hover:text-primary transition-colors duration-200 cursor-default">
                <i className="fa-regular fa-calendar"></i>
                {fechaLarga}
              </p>
              <p className="flex items-center gap-2 hover:text-primary transition-colors duration-200 cursor-default">
                <i className="fa-regular fa-clock"></i>
                {horaRango}
              </p>
              <p className="flex items-center gap-2 hover:text-primary transition-colors duration-200 cursor-default">
                <i className="fa-solid fa-location-dot"></i>
                {ubicacion}
              </p>
            </div>

            <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.4s" }}>
              <h2 className="font-bold text-base sm:text-lg mb-2 text-gray-800">SOBRE ESTE EVENTO</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {evento.descripcion}
              </p>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.5s" }}
            >
              {[
                { icon: "fa-solid fa-utensils", title: "CATERING INCLUIDO", desc: "Café y alimentos incluidos." },
                { icon: "fa-solid fa-file-lines", title: "CONSTANCIA DE ASISTENCIA", desc: "Se emitirán certificados digitales a los participantes para sus portafolios profesionales." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-3 sm:p-4 border-l-4 border-yellow-400 bg-gray-50 rounded-lg"
                  style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <p className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm md:text-base">
                    <i className={item.icon}></i>
                    {item.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="xl:col-span-4 space-y-5 sm:space-y-6"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(20px)", transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s" }}
          >
            <div className="p-4 sm:p-5 md:p-6 border-t-4 border-primary rounded-xl shadow-md space-y-4">
              <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-400">
                <span>ESTUDIANTES INSCRITOS</span>
                <span
                  className="text-xs sm:text-sm"
                  style={{ transition: "transform 0.3s ease", transform: countAnimating ? "scale(1.3)" : "scale(1)", display: "inline-block" }}
                >
                  <b className="text-primary">{confirmados}</b> / {capacidad}
                </span>
              </div>

              <Progress value={porcentaje} />

              {lleno ? (
                <button disabled className="w-full py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base bg-gray-200 text-gray-400 cursor-not-allowed">
                  CUPO AGOTADO
                  <i className="fa-solid fa-ban"></i>
                </button>
              ) : !confirmado ? (
                <button
                  onClick={handleConfirmar}
                  className="w-full py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base bg-black/75 text-white cursor-pointer"
                  style={{ transition: "background-color 0.25s ease, transform 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.transform = "translateY(0)"; }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                >
                  CONFIRMAR ASISTENCIA
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              ) : (
                <div className="confirmed-enter space-y-2">
                  <div className="w-full py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base bg-green-700 text-white">
                    INSCRIPCIÓN CONFIRMADA
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <button
                    onClick={handleCancelar}
                    className="w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-xs sm:text-sm border border-red-300 text-red-500 cursor-pointer"
                    style={{ transition: "background-color 0.2s ease, transform 0.15s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fef2f2"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                    Cancelar inscripción
                  </button>
                </div>
              )}
            </div>

            {evento.unidadAcademica && (
              <a
                target="_blank"
                href="/departamentos"
                className="mb-4"
              >
                <div
                  className="p-4 sm:p-5 rounded-xl border shadow-sm space-y-4 cursor-pointer"
                  style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
                >
                  <p className="text-[10px] sm:text-xs text-gray-400">ORGANIZADO POR</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
                      <i className="fa-solid fa-building"></i>
                    </div>
                    <div>
                      <span className="font-semibold text-xs sm:text-sm">
                        {evento.unidadAcademica.nombre}
                      </span>
                      {evento.carrera && (
                        <p className="text-[10px] sm:text-xs text-gray-500">{evento.carrera.nombre}</p>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            )}

            <div className="space-y-3">
              <p className="text-[10px] sm:text-xs text-gray-400 pt-4">EVENTOS RELACIONADOS</p>
              <div className="flex flex-row xl:flex-col gap-3 overflow-x-auto pb-1 xl:pb-0 xl:overflow-visible">
                {[1, 2, 3].map((item, i) => (
                  <div
                    key={item}
                    className="shrink-0 w-44 sm:w-52 md:w-56 xl:w-auto flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border cursor-pointer"
                    style={{ opacity: visible ? 1 : 0, transition: `opacity 0.4s ease ${0.5 + i * 0.1}s, transform 0.2s ease, box-shadow 0.2s ease` }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-calendar-days text-gray-500"></i>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-400">12 NOV</p>
                      <p className="text-xs sm:text-sm font-medium leading-snug">Taller de Ética en Robótica</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg bg-green-600 text-white text-sm font-medium"
        style={{
          opacity: mostrarToast ? 1 : 0,
          transform: mostrarToast ? "translateY(0)" : "translateY(16px)",
          pointerEvents: mostrarToast ? "auto" : "none",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-check text-white text-xs"></i>
        </div>
        <div>
          <p className="leading-tight">¡Inscripción confirmada!</p>
          <p className="text-xs text-green-100 font-normal">Te esperamos el 24 de octubre</p>
        </div>
      </div>

      <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg bg-red-500 text-white text-sm font-medium"
        style={{
          opacity: toastCancelacion ? 1 : 0,
          transform: toastCancelacion ? "translateY(0)" : "translateY(16px)",
          pointerEvents: toastCancelacion ? "auto" : "none",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-xmark text-white text-xs"></i>
        </div>
        <div>
          <p className="leading-tight">Inscripción cancelada</p>
          <p className="text-xs text-red-100 font-normal">Puedes volver a inscribirte cuando quieras</p>
        </div>
      </div>
    </main>
  );
};

export default EventosView;