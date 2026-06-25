import { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { API_URL, http } from "../hooks/http";
import { Evento as EventoModel } from "../models/Evento.model";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  resource: EventoModel;
}

function EventDetailModal({
  event,
  onClose,
}: {
  event: EventoModel;
  onClose: () => void;
}) {
  const fechaInicio = event.fechaInicio ? new Date(event.fechaInicio) : null;
  const fechaFin = event.fechaFin ? new Date(event.fechaFin) : null;

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 bg-gray-100">
          {event.imagenDestacada?.ruta ? (
            <img
              src={`${API_URL}/recursos${event.imagenDestacada.ruta}`}
              className="w-full h-full object-cover"
              alt={event.nombre}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fa-solid fa-calendar-star text-5xl text-gray-300"></i>
            </div>
          )}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
          >
            <i className="fa-solid fa-xmark text-sm" aria-hidden="true"></i>
          </button>
          {event.categoriaEvento?.nombre && (
            <span className="absolute bottom-3 left-3 px-3 py-1 text-xs font-bold bg-primary text-white rounded">
              {event.categoriaEvento.nombre}
            </span>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 leading-snug">{event.nombre}</h2>

          <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
            {fechaInicio && (
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-calendar text-primary mt-0.5"></i>
                <div>
                  <p className="font-medium text-gray-800">{formatDate(fechaInicio)}</p>
                  <p className="text-gray-500">
                    {formatTime(fechaInicio)}
                    {fechaFin ? ` – ${formatTime(fechaFin)}` : ""}
                  </p>
                </div>
              </div>
            )}

            {(event.lugar || event.unidadAcademica?.nombre) && (
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-location-dot text-primary"></i>
                <span>{event.lugar ?? event.unidadAcademica?.nombre}</span>
              </div>
            )}

            {event.capacidadMaxima != null && event.capacidadMaxima > 0 && (
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-users text-primary"></i>
                <span>
                  {event.capacidadMaxima <= 10
                    ? `Limitado: ${event.capacidadMaxima} lugares libres`
                    : `${event.capacidadMaxima}+ lugares disponibles`}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                (window.location.href = `${EventoModel.BASE_ROUTE}?id=${event.id}`)
              }
              className="flex-1 bg-primary text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-primary/90 transition cursor-pointer"
            >
              Ver evento completo
            </button>
            <button
              onClick={onClose}
              className="px-4 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCell({ event }: { event: CalendarEvent }) {
  const e = event.resource;
  const esLimitado =
    e.capacidadMaxima != null && e.capacidadMaxima > 0 && e.capacidadMaxima <= 10;

  return (
    <div className="flex items-center gap-1 truncate">
      <span
        className={`shrink-0 w-2 h-2 rounded-full ${esLimitado ? "bg-orange-500" : "bg-primary"
          }`}
      />
      <span className="truncate text-xs font-medium">{event.title}</span>
    </div>
  );
}

export default function EventosCalendario() {
  const [eventosApi, setEventosApi] = useState<EventoModel[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<EventoModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);

  const obtenerEventos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await http.get<EventoModel[]>(
        `${EventoModel.ENDPOINTS.DEFAULT}?expand=${EventoModel.EXPAND.DEFAULT}`
      );
      if (response.status === 200 && Array.isArray(response.resultado)) {
        setEventosApi(response.resultado);

        const mapped: CalendarEvent[] = response.resultado
          .filter((e) => e.fechaInicio)
          .map((e) => ({
            id: e.id,
            title: e.nombre ?? "Sin nombre",
            start: new Date(e.fechaInicio!),
            end: e.fechaFin ? new Date(e.fechaFin) : new Date(e.fechaInicio!),
            resource: e,
          }));

        setCalendarEvents(mapped);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void obtenerEventos();
  }, [obtenerEventos]);

  const messages = {
    today: "Hoy",
    previous: "‹",
    next: "›",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay eventos en este período.",
    showMore: (total: number) => `+${total} más`,
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Calendario de Eventos</h1>
        <p className="text-gray-500">
          Visualiza y explora todos los eventos del mes.
        </p>
      </div>

      <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
          Disponible
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
          Cupo limitado
        </div>
        {loading && (
          <div className="flex items-center gap-2 ml-auto text-primary">
            <i className="fa-solid fa-spinner fa-spin"></i>
            Cargando eventos…
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          messages={messages}
          date={currentDate}
          onNavigate={setCurrentDate}
          view={currentView}
          onView={(v) => setCurrentView(v)}
          style={{ height: 680 }}
          onSelectEvent={(event) => setSelectedEvento(event.resource)}
          components={{
            event: EventCell,
          }}
          eventPropGetter={(event) => {
            const e = event.resource as EventoModel;
            const esLimitado =
              e.capacidadMaxima != null &&
              e.capacidadMaxima > 0 &&
              e.capacidadMaxima <= 10;
            return {
              style: {
                backgroundColor: esLimitado
                  ? "rgba(249, 115, 22, 0.1)"
                  : "rgba(var(--color-primary-rgb, 79 70 229) / 0.08)",
                color: esLimitado ? "#c2410c" : "var(--color-primary, #4f46e5)",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              },
            };
          }}
          dayPropGetter={(date) => {
            const today = new Date();
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear();
            return isToday
              ? { style: { backgroundColor: "rgba(var(--color-primary-rgb, 79 70 229) / 0.04)" } }
              : {};
          }}
          popup
          selectable={false}
        />
      </div>

      <style>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-toolbar {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #f0f0f0;
          gap: 0.5rem;
        }
        .rbc-toolbar-label {
          font-size: 1.125rem;
          font-weight: 700;
          text-transform: capitalize;
        }
        .rbc-btn-group button {
          font-size: 0.875rem;
          border-radius: 0.5rem !important;
          border-color: #e5e7eb !important;
          color: #374151;
          cursor: pointer;
        }
        .rbc-btn-group button:hover {
          background: #f9fafb;
        }
        .rbc-btn-group button.rbc-active {
          background: #f3f4f6 !important;
          color: #111827 !important;
          font-weight: 600;
        }
        .rbc-header {
          padding: 0.625rem 0;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          border-color: #f0f0f0 !important;
        }
        .rbc-month-view,
        .rbc-month-row,
        .rbc-day-bg {
          border-color: #f3f4f6 !important;
        }
        .rbc-date-cell {
          padding: 0.375rem 0.5rem;
          font-size: 0.875rem;
          color: #374151;
        }
        .rbc-date-cell.rbc-now > a {
          background: var(--color-primary, #4f46e5);
          color: #fff;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .rbc-off-range-bg {
          background: #fafafa;
        }
        .rbc-off-range .rbc-date-cell {
          color: #d1d5db;
        }
        .rbc-event {
          padding: 2px 6px !important;
        }
        .rbc-event:focus,
        .rbc-event.rbc-selected {
          outline: none !important;
          box-shadow: none !important;
        }
        .rbc-show-more {
          font-size: 0.7rem;
          color: var(--color-primary, #4f46e5);
          font-weight: 600;
          padding: 2px 4px;
        }
        .rbc-today {
          background: transparent !important;
        }
        .rbc-agenda-view table.rbc-agenda-table {
          font-size: 0.875rem;
        }
      `}</style>

      {selectedEvento && (
        <EventDetailModal
          event={selectedEvento}
          onClose={() => setSelectedEvento(null)}
        />
      )}
    </div>
  );
}