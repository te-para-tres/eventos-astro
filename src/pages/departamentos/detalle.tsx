import React, { useState } from "react";

const departamentos: Record<string, {
  id: string;
  nombre: string;
  division: string;
  descripcion: string;
  mision: string;
  docentes: number;
  estudiantes: number;
  programas: string[];
  eventos: { titulo: string; fecha: string }[];
}> = {
  ia: {
    id: "ia",
    nombre: "Departamento de Inteligencia Artificial",
    division: "Ingeniería",
    descripcion: "Modelos de IA, machine learning y ética tecnológica.",
    mision:
      "Formar profesionales capaces de diseñar, implementar y evaluar sistemas de inteligencia artificial con responsabilidad ética, contribuyendo al avance científico y tecnológico de la sociedad.",
    docentes: 18,
    estudiantes: 340,
    programas: ["Licenciatura en IA", "Maestría en Machine Learning", "Diplomado en Ética Digital"],
    eventos: [
      { titulo: "Gemini y sus funciones", fecha: "24 Oct 2026" },
      { titulo: "Taller de Ética en Robótica", fecha: "12 Nov 2026" },
      { titulo: "Congreso Internacional de IA", fecha: "5 Dic 2026" },
    ],
  },
  software: {
    id: "software",
    nombre: "Departamento de Ingeniería de Software",
    division: "Ingeniería",
    descripcion: "Desarrollo de sistemas y aplicaciones.",
    mision:
      "Desarrollar ingenieros de software competentes en metodologías ágiles, arquitectura de sistemas y buenas prácticas de desarrollo para resolver problemas reales con soluciones escalables.",
    docentes: 22,
    estudiantes: 510,
    programas: ["Licenciatura en Ing. de Software", "Maestría en Arquitectura de Software", "Diplomado en DevOps"],
    eventos: [
      { titulo: "Hackathon UES 2026", fecha: "3 Nov 2026" },
      { titulo: "Clean Code Workshop", fecha: "18 Nov 2026" },
    ],
  },
  redes: {
    id: "redes",
    nombre: "Departamento de Redes",
    division: "Ingeniería",
    descripcion: "Infraestructura, seguridad y telecomunicaciones.",
    mision:
      "Capacitar especialistas en diseño, administración y seguridad de redes de comunicación, preparados para enfrentar los desafíos de la ciberseguridad moderna.",
    docentes: 14,
    estudiantes: 280,
    programas: ["Licenciatura en Redes", "Diplomado en Ciberseguridad", "Certificación en Cloud Networking"],
    eventos: [
      { titulo: "CTF — Capture The Flag", fecha: "8 Nov 2026" },
      { titulo: "Seminario de Ciberseguridad", fecha: "20 Nov 2026" },
    ],
  },
  industrial: {
    id: "industrial",
    nombre: "Departamento de Ingeniería Industrial",
    division: "Ingeniería",
    descripcion: "Optimización de procesos y logística.",
    mision:
      "Formar ingenieros industriales con visión sistémica para optimizar procesos productivos, mejorar la cadena de suministro y aplicar herramientas de calidad en entornos empresariales.",
    docentes: 16,
    estudiantes: 390,
    programas: ["Licenciatura en Ing. Industrial", "Maestría en Logística", "Diplomado en Lean Manufacturing"],
    eventos: [
      { titulo: "Feria de Proyectos Industriales", fecha: "15 Nov 2026" },
    ],
  },
  psicologia: {
    id: "psicologia",
    nombre: "Departamento de Psicología",
    division: "Ciencias Sociales",
    descripcion: "Salud mental y comportamiento humano.",
    mision:
      "Contribuir al bienestar psicológico individual y colectivo mediante la formación de profesionales con sólidas bases científicas y compromiso humanista con la sociedad.",
    docentes: 20,
    estudiantes: 460,
    programas: ["Licenciatura en Psicología", "Maestría en Psicología Clínica", "Diplomado en Neuropsicología"],
    eventos: [
      { titulo: "Jornada de Salud Mental", fecha: "10 Nov 2026" },
      { titulo: "Simposio de Psicología Social", fecha: "28 Nov 2026" },
    ],
  },
};

interface Props {
  id?: string;
}

const DetalleDepartamento: React.FC<Props> = ({ id }) => {
  const deptId = id ?? window.location.pathname.split("/").pop() ?? "ia";
  const depto = departamentos[deptId] ?? departamentos["ia"];

  const [confirmado, setConfirmado] = useState(false);

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
        <span className="text-gray-700 font-medium truncate">{depto.nombre}</span>
      </nav>

      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 lg:gap-8">

        <div className="xl:col-span-8 space-y-6">

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md">
              <i className="fa-solid fa-building text-xl sm:text-2xl"></i>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{depto.division}</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {depto.nombre}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-primary">{depto.docentes}</p>
              <p className="text-xs text-gray-500 mt-1">Docentes</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-primary">{depto.estudiantes}</p>
              <p className="text-xs text-gray-500 mt-1">Estudiantes</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center col-span-2 sm:col-span-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-primary">{depto.programas.length}</p>
              <p className="text-xs text-gray-500 mt-1">Programas</p>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-base sm:text-lg text-gray-800 mb-2">MISIÓN</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{depto.mision}</p>
          </div>

          <div>
            <h2 className="font-bold text-base sm:text-lg text-gray-800 mb-3">PROGRAMAS ACADÉMICOS</h2>
            <div className="flex flex-col gap-2">
              {depto.programas.map((prog, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border bg-gray-50 hover:shadow-sm transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-graduation-cap text-primary text-sm"></i>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-primary transition">
                    {prog}
                  </span>
                  <i className="fa-solid fa-chevron-right text-gray-300 text-xs ml-auto group-hover:text-primary transition"></i>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="xl:col-span-4 space-y-5">

          <div className="p-5 border-t-4 border-primary rounded-xl shadow-md space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Contacto</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <i className="fa-regular fa-envelope text-primary w-4"></i>
                depto.{depto.id}@ues.edu.sv
              </p>
              <p className="flex items-center gap-2">
                <i className="fa-solid fa-phone text-primary w-4"></i>
                +503 2222-{1000 + Object.keys(departamentos).indexOf(depto.id)}
              </p>
              <p className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-primary w-4"></i>
                Edificio de {depto.division}, UES
              </p>
            </div>
            <button className="w-full bg-black/75 text-white py-2.5 rounded-lg font-semibold hover:bg-primary transition flex items-center justify-center gap-2 text-sm cursor-pointer mt-2">
              Enviar mensaje
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border shadow-sm space-y-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Próximos eventos</p>
            <div className="flex flex-col gap-3">
              {depto.eventos.map((ev, i) => (
                <div
                  key={i}
                  onClick={() => (window.location.href = "/eventos")}
                  className="flex items-center gap-3 p-2.5 rounded-lg border hover:shadow-sm transition cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-calendar-days text-gray-400"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{ev.fecha}</p>
                    <p className="text-sm font-medium leading-snug truncate group-hover:text-primary transition">
                      {ev.titulo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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