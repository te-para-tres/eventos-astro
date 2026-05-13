import React, { useState, useEffect } from "react";
import { Progress } from "../../components/ui/Progress";
// import "../../styles/global.css"

const CAPACIDAD = 200;
const INICIAL_CONFIRMADOS = 42;

const EventosView: React.FC = () => {
  const [confirmados, setConfirmados] = useState(INICIAL_CONFIRMADOS);
  const [confirmado, setConfirmado] = useState(false);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [toastCancelacion, setToastCancelacion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [countAnimating, setCountAnimating] = useState(false);

  const porcentaje = (confirmados / CAPACIDAD) * 100;
  const lleno = confirmados >= CAPACIDAD && !confirmado;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
                src="/img/image.png"
                alt="Evento"
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
              Conoce al creador del modelo de código más utilizado en la UES:
              Gemini y sus funciones
            </h1>

            <div
              className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600"
              style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}
            >
              <p className="flex items-center gap-2 hover:text-primary transition-colors duration-200 cursor-default">
                <i className="fa-regular fa-calendar"></i>
                Viernes, 24 de Octubre, 2026
              </p>
              <p className="flex items-center gap-2 hover:text-primary transition-colors duration-200 cursor-default">
                <i className="fa-regular fa-clock"></i>
                9:00 AM – 4:30 PM
              </p>
              <p className="flex items-center gap-2 hover:text-primary transition-colors duration-200 cursor-default">
                <i className="fa-solid fa-location-dot"></i>
                Centro de Innovación, Aula K03
              </p>
            </div>

            <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.4s" }}>
              <h2 className="font-bold text-base sm:text-lg mb-2 text-gray-800">SOBRE ESTE EVENTO</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Únase a nosotros en nuestro simposio anual insignia donde cerramos la brecha entre la
                inteligencia artificial de vanguardia y la ética institucional. Este año, reuniremos a
                investigadores de clase mundial, responsables de políticas y líderes estudiantiles para
                discutir cómo los modelos de IA están remodelando el panorama de la integridad
                académica y el aprendizaje personalizado. El evento contará con conferencias magistrales
                de líderes de la industria, seguidas de sesiones interactivas y un almuerzo de
                networking en el atrio. Ya sea que seas estudiante de ciencias de la computación
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
                  <b className="text-primary">{confirmados}</b> / {CAPACIDAD}
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

            <div
              className="p-4 sm:p-5 rounded-xl border shadow-sm space-y-4"
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
                  <a href="/departamentos" className="font-semibold text-xs sm:text-sm hover:underline">
                    Departamento de IA
                  </a>
                  <p className="text-[10px] sm:text-xs text-gray-500">División de Ingeniería</p>
                </div>
              </div>
              <button
                onClick={() => (window.location.href = "/departamentos")}
                className="w-full border py-2 rounded-lg text-primary font-medium text-xs sm:text-sm cursor-pointer"
                style={{ transition: "background-color 0.2s ease, color 0.2s ease, transform 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary)"; e.currentTarget.style.color = "white"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.color = ""; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Ver departamento
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] sm:text-xs text-gray-400">EVENTOS RELACIONADOS</p>
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