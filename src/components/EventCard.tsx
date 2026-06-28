import dayjs from "dayjs";
import "dayjs/locale/es";
import { Evento as EventoModel } from "@/models/Evento.model";
import { API_URL } from "@/constants";

function formatDateLabel(fechaInicio?: string, fechaFin?: string): string {
  if (!fechaInicio) return "";
  const inicio = dayjs(fechaInicio).locale("es");
  const base = `${inicio.format("D MMM")}, ${inicio.format("HH:mm")}`;
  if (!fechaFin) return base;
  return `${base} – ${dayjs(fechaFin).locale("es").format("HH:mm")}`;
}

export default function EventCard({ event }: { event: EventoModel }) {
  const lugares = event.capacidadMaxima ?? 0;
  const esLimitado = lugares > 0 && lugares <= 10;
  const availability = esLimitado
    ? `Limitado: ${lugares} libres`
    : `${lugares > 0 ? lugares + "+" : "Sin límite de"} lugares disponibles`;
  const availabilityBg = esLimitado ? "bg-orange-500" : "bg-emerald-500";

  return (
    <a
      href={`/eventos/${event.id}`}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition hover:shadow-xl hover:-translate-y-1 group cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.imagenDestacada?.ruta ? `${API_URL}/recursos${event.imagenDestacada.ruta}` : undefined}
          alt={event.nombre ?? "Evento"}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded">
            {event.categoriaEvento?.nombre}
          </span>
          <span className={`px-3 py-1 text-xs font-bold text-white rounded ${availabilityBg}`}>
            {availability}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col grow">
        <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
          {event.nombre}
        </h3>
        <div className="flex flex-col gap-2 text-sm text-gray-500 mt-auto">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock text-primary" aria-hidden="true"></i>
            {formatDateLabel(event.fechaInicio, event.fechaFin)}
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-primary" aria-hidden="true"></i>
            {event.lugar ?? event.unidadAcademica?.nombre}
          </div>
        </div>
      </div>
    </a>
  );
}
