import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type EventoMock = {
  title: string;
  category: string;
  dateLabel: string;
  location: string;
  image: string;
  campus: string;
};

const eventoMockup: EventoMock = {
  title: "IA en Ética: Un Seminario Profundo",
  category: "Seminario",
  dateLabel: "12 Oct, 2:00 PM – 4:00 PM",
  location: "Campus Hermosillo, Aula 402",
  campus: "Hermosillo",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCw9OQKmd4EtyO4PfgSh2D5OLffvTN1dkZ0Xplq1rCO7NflOMdKJkzneOOvIi843e309t4I4LpIuuI0kF5D-oiLSWJqPyJ2NK8x8FfhZW3idaLhLRjo1GvbqhNc9ULX-GR5M7qY0vK5bg-IcafsnuteoyMZEvF60O2cVN66U-lCb3_XeMmy5hWk64Jp3VDAn3hi6vTNlYNFt2zsnXbO_gHXWQd8byLs7n83ZpB8KN1dQ4-cgSDLMsmDuv4VWQYDO2l0QjiFXavZ-g",
};

const RegistroEventoView: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    carrera: "",
    telefono: "",
  });

  const [registrado, setRegistrado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrado(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6">
      <div className="bg-white border md:border-2 border-gray-200 md:border-primary rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all">
        <div className="md:w-5/12 bg-gray-50 relative flex flex-col">
          <div className="h-48 md:h-64 relative overflow-hidden shrink-0">
            <img
              src={eventoMockup.image}
              alt={eventoMockup.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded shadow-sm">
                {eventoMockup.category}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col grow">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-4 leading-tight">
              {eventoMockup.title}
            </h2>

            <div className="flex flex-col gap-4 text-gray-600 mt-2">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-clock text-primary mt-1"></i>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">Fecha y Hora</p>
                  <p className="text-sm">{eventoMockup.dateLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot text-primary mt-1"></i>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">Ubicación</p>
                  <p className="text-sm">{eventoMockup.location}</p>
                  <p className="text-sm text-gray-500">Campus {eventoMockup.campus}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 mt-auto">
              <p className="text-xs md:text-sm text-gray-500 italic">
                Al registrarte a este evento, aseguras tu lugar y recibirás un recordatorio antes de que comience.
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-7/12 p-6 md:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-3xl font-extrabold mb-2 text-gray-800">
              Registro al Evento
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Completa la siguiente información para confirmar tu asistencia.
            </p>
          </div>

          {registrado ? (
            <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-800 p-8 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in shadow-sm">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg transform transition-transform hover:scale-110">
                <i className="fa-solid fa-check"></i>
              </div>
              <h4 className="text-2xl font-bold mb-2">¡Registro Exitoso!</h4>
              <p className="text-emerald-700 text-sm md:text-base">
                Tu lugar ha sido reservado. Te hemos enviado un correo de confirmación con los detalles.
              </p>
              <button
                onClick={() => window.location.href = "/"}
                className="mt-6 px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition cursor-pointer shadow-md"
              >
                Volver al Inicio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">

              <div className="flex flex-col gap-2 relative">
                <label htmlFor="nombre" className="font-semibold text-gray-700 text-sm md:text-base">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <i className="fa-regular fa-user text-gray-400 group-focus-within:text-primary"></i>
                  </div>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative">
                <label htmlFor="carrera" className="font-semibold text-gray-700 text-sm md:text-base">
                  Carrera <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <i className="fa-solid fa-graduation-cap text-gray-400 group-focus-within:text-primary"></i>
                  </div>
                  <input
                    type="text"
                    id="carrera"
                    name="carrera"
                    required
                    value={formData.carrera}
                    onChange={handleChange}
                    placeholder="Ej. Ingeniería de Software"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative">
                <label htmlFor="telefono" className="font-semibold text-gray-700 text-sm md:text-base">
                  Número de Teléfono <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <i className="fa-solid fa-phone text-gray-400 group-focus-within:text-primary"></i>
                  </div>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    required
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej. 662 123 4567"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 w-full py-3.5 md:py-4 bg-primary text-white font-bold text-lg rounded-xl shadow-lg hover:opacity-90 hover:-translate-y-1 transition-transform cursor-pointer flex justify-center items-center gap-2 group"
              >
                Aceptar y Registrarse
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default RegistroEventoView;
