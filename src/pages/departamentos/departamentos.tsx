import React from "react";

const departamentos = [
  {
    id: "ia",
    nombre: "Departamento de Inteligencia Artificial",
    division: "Ingeniería",
    descripcion: "Modelos de IA, machine learning y ética tecnológica.",
  },
  {
    id: "software",
    nombre: "Departamento de Ingeniería de Software",
    division: "Ingeniería",
    descripcion: "Desarrollo de sistemas y aplicaciones.",
  },
  {
    id: "redes",
    nombre: "Departamento de Redes",
    division: "Ingeniería",
    descripcion: "Infraestructura, seguridad y telecomunicaciones.",
  },
  {
    id: "industrial",
    nombre: "Departamento de Ingeniería Industrial",
    division: "Ingeniería",
    descripcion: "Optimización de procesos y logística.",
  },
  {
    id: "psicologia",
    nombre: "Departamento de Psicología",
    division: "Ciencias Sociales",
    descripcion: "Salud mental y comportamiento humano.",
  },
];

export default function Departamentos() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      <h1 className="text-4xl font-extrabold mb-10">
        Departamentos
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {departamentos.map((d) => (
          <div
            key={d.id}
            onClick={() => (window.location.href = `/departamentos/${d.id}`)}
            className="border rounded-xl p-6 hover:shadow-lg transition cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                <i className="fa-solid fa-building"></i>
              </div>

              <div>
                <h2 className="font-bold group-hover:text-primary">
                  {d.nombre}
                </h2>
                <p className="text-xs text-gray-500">
                  {d.division}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              {d.descripcion}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}