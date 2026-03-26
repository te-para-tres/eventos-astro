import React from "react";
import { Progress } from "../../components/ui/Progress";

const EventosView: React.FC = () => {
  const disponibles = 158;
  const total = 200;
  const porcentaje = (disponibles / total) * 100;

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <section className="grid grid-cols-12 gap-8">

        <div className="col-span-8 space-y-6">

          <img
            src="/img/image.png"
            alt="Evento"
            className="w-full h-95 object-cover rounded-xl shadow-md"
          />

          <h1 className="text-3xl font-extrabold text-primary leading-tight">
            Conoce al creador del modelo de código más utilizado en la UES:
            Gemini y sus funciones
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600">

            <p className="flex items-center gap-2">
              <i className="fa-regular fa-calendar"></i>
              Viernes, 24 de Octubre, 2026
            </p>

            <p className="flex items-center gap-2">
              <i className="fa-regular fa-clock"></i>
              9:00 AM – 4:30 PM
            </p>

            <p className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot"></i>
              Centro de Innovación, Aula K03
            </p>

          </div>

          <div>
            <h2 className="font-bold text-lg mb-2 text-gray-800">
              SOBRE ESTE EVENTO
            </h2>

            <p className="text-gray-600 leading-relaxed">
             Únase a nosotros en nuestro simposio anual insignia donde cerramos la brecha entre la inteligencia artificial de vanguardia
              y la ética institucional. Este año, reuniremos a investigadores de clase mundial, responsables de políticas y líderes
               estudiantiles para discutir cómo los modelos de IA están remodelando el panorama de la integridad académica 
               y el aprendizaje personalizado. El evento contará con conferencias magistrales de líderes de la industria,
                seguidas de sesiones interactivas y un almuerzo de networking en el atrio. Ya sea que seas estudiante de 
                ciencias de la computación o un
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 border-l-4 border-yellow-400 bg-gray-50 rounded-lg">
              <p className=" flex items-center gap-2 text-primary font-bold">
                <i className="fa-solid fa-utensils text-primary font-bold"></i>
                CATERING INCLUIDO
              </p>
              <p className="text-sm text-gray-500">
                Café y alimentos incluidos.
              </p>
            </div>

            <div className="p-4 border-l-4 border-yellow-400 bg-gray-50 rounded-lg">
              <p className="font-bold flex items-center gap-2 text-primary">
                <i className="fa-solid fa-file-lines text-primary font-bold"></i>
                CONSTANCIA DE ASISTENCIA
              </p>
              <p className="text-sm text-gray-500">
                Se emitirán certificados digitales a los participantes para sus portafolios profesionales.
              </p>
            </div>

          </div>
        </div>

        <div className="col-span-4 space-y-6">

          <div className="p-6 border-t-4 border-primary rounded-xl shadow-md space-y-4">

            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>LUGARES DISPONIBLES</span>

              <span className="text-sm">
                <b className="text-primary">{disponibles}</b> / {total}
              </span>
            </div>

            <Progress value={porcentaje} />

            <button className="w-full bg-black/75 text-white py-3 rounded-lg font-semibold hover:bg-primary transition flex items-center justify-center gap-2 hover:cursor-pointer">
              CONFIRMAR ASISTENCIA
              <i className="fa-solid fa-arrow-right"></i>
            </button>

          </div>

          <div className="p-5 rounded-xl border shadow-sm space-y-4">

            <p className="text-xs text-gray-400">
              ORGANIZADO POR
            </p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <i className="fa-solid fa-building"></i>
              </div>

              <div>
                <p className="font-semibold text-sm">
                  Departamento de IA
                </p>
                <p className="text-xs text-gray-500">
                  División de Ingeniería
                </p>
              </div>
            </div>

            <button className="w-full border py-2 rounded-lg text-primary font-medium hover:bg-primary hover:text-white hover:cursor-pointer transition">
              Seguir departamento
            </button>
          </div>

          <div className="space-y-3">

            <p className="text-xs text-gray-400">
              EVENTOS RELACIONADOS
            </p>

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition cursor-pointer"
              >
                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <i className="fa-solid fa-calendar-days text-gray-500"></i>
                </div>

                <div>
                  <p className="text-xs text-gray-400">12 NOV</p>
                  <p className="text-sm font-medium">
                    Taller de Ética en Robótica
                  </p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>
    </main>
  );
};

export default EventosView;